import { Cluster, PublicKey, SendOptions } from '@solana/web3.js';
import {
  MessageHandlers,
  PromiseCallback,
  SolflareConfig,
  SolflareIframeEvent,
  SolflareIframeMessage,
  SolflareIframeRequest,
  SolflareIframeResizeCoordinates,
  SolflareIframeResizeMessage,
  TransactionOrVersionedTransaction
} from './types';
import EventEmitter from 'eventemitter3';
import bs58 from 'bs58';
import { v4 as uuidv4 } from 'uuid';
import { addSignature, serializeTransaction, serializeTransactionMessage } from './utils';

export default class Solflare extends EventEmitter {
  private _network: Cluster = 'mainnet-beta';
  private _element: HTMLElement | null = null;
  private _iframe: HTMLIFrameElement | null = null;
  private _publicKey: string | null = null;
  private _isConnected = false;
  private _connectHandler: { resolve: PromiseCallback; reject: PromiseCallback } | null = null;
  private _messageHandlers: MessageHandlers = {};

  private static IFRAME_URL = 'https://connect.solflare.com/';
  // private static IFRAME_URL = 'http://localhost:3090/';
  // private static IFRAME_URL = 'https://connect-metamask-demo.solflare.com/';

  constructor(config?: SolflareConfig) {
    super();

    if (config?.network) {
      this._network = config?.network;
    }
  }

  get publicKey() {
    return this._publicKey ? new PublicKey(this._publicKey) : null;
  }

  get isConnected() {
    return this._isConnected;
  }

  get connected() {
    return this.isConnected;
  }

  get autoApprove() {
    return false;
  }

  async connect() {
    if (this.connected) {
      return;
    }

    this._injectElement();

    await new Promise((resolve, reject) => {
      this._connectHandler = { resolve, reject };
    });
  }

  async disconnect() {
    await this._sendIframeMessage({
      method: 'disconnect'
    });

    this._disconnected();

    this.emit('disconnect');
  }

  async signTransaction(
    transaction: TransactionOrVersionedTransaction
  ): Promise<TransactionOrVersionedTransaction> {
    if (!this.connected || !this.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      const serializedMessage = serializeTransactionMessage(transaction);

      const { signature } = (await this._sendIframeMessage({
        method: 'signTransaction',
        params: {
          message: bs58.encode(serializedMessage)
        }
      })) as { publicKey: string; signature: string };

      addSignature(transaction, this.publicKey, bs58.decode(signature));

      return transaction;
    } catch (e) {
      throw new Error(e?.toString?.() || 'Failed to sign transaction');
    }
  }

  async signAllTransactions(
    transactions: TransactionOrVersionedTransaction[]
  ): Promise<TransactionOrVersionedTransaction[]> {
    if (!this.connected || !this.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      const serializedMessages = transactions.map((transaction) =>
        serializeTransactionMessage(transaction)
      );

      const { signatures } = (await this._sendIframeMessage({
        method: 'signAllTransactions',
        params: {
          messages: serializedMessages.map((message) => bs58.encode(message))
        }
      })) as { publicKey: string; signatures: string[] };

      for (let i = 0; i < transactions.length; i++) {
        addSignature(transactions[i], this.publicKey, bs58.decode(signatures[i]));
      }

      return transactions;
    } catch (e) {
      throw new Error(e?.toString?.() || 'Failed to sign transactions');
    }
  }

  async signAndSendTransaction(
    transaction: TransactionOrVersionedTransaction,
    options?: SendOptions
  ): Promise<string> {
    if (!this.connected || !this.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      const serializedTransaction = serializeTransaction(transaction);

      const result = await this._sendIframeMessage({
        method: 'signAndSendTransaction',
        params: {
          transaction: bs58.encode(serializedTransaction),
          options
        }
      });

      return result as string;
    } catch (e) {
      throw new Error(e?.toString?.() || 'Failed to sign and send transaction');
    }
  }

  async signMessage(data: Uint8Array, display: 'hex' | 'utf8' = 'utf8'): Promise<Uint8Array> {
    if (!this.connected || !this.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      const result = await this._sendIframeMessage({
        method: 'signMessage',
        params: {
          data,
          display
        }
      });

      return Uint8Array.from(bs58.decode(result as string));
    } catch (e) {
      throw new Error(e?.toString?.() || 'Failed to sign message');
    }
  }

  async sign(data: Uint8Array, display: 'hex' | 'utf8' = 'utf8'): Promise<Uint8Array> {
    return await this.signMessage(data, display);
  }

  private _handleEvent = (event: SolflareIframeEvent) => {
    switch (event.type) {
      case 'connect': {
        this._collapseIframe();

        if (event.data?.publicKey) {
          this._publicKey = event.data.publicKey;

          this._isConnected = true;

          if (this._connectHandler) {
            this._connectHandler.resolve();
            this._connectHandler = null;
          }

          this.emit('connect', this.publicKey);
        } else {
          if (this._connectHandler) {
            this._connectHandler.reject();
            this._connectHandler = null;
          }

          this._disconnected();

          this.emit('disconnect');
        }
        return;
      }
      case 'disconnect': {
        if (this._connectHandler) {
          this._connectHandler.reject();
          this._connectHandler = null;
        }

        this._disconnected();

        this.emit('disconnect');

        return;
      }
      case 'accountChanged': {
        if (event.data?.publicKey) {
          this._publicKey = event.data.publicKey;

          this.emit('accountChanged', this.publicKey);
        } else {
          this.emit('accountChanged', undefined);
        }

        return;
      }
      default: {
        return;
      }
    }
  };

  private _handleResize = (data: SolflareIframeResizeMessage) => {
    if (data.resizeMode === 'full') {
      if (data.params.mode === 'fullscreen') {
        this._expandIframe();
      } else if (data.params.mode === 'hide') {
        this._collapseIframe();
      }
    } else if (data.resizeMode === 'coordinates') {
      this._resizeIframe(data.params);
    }
  };

  private _handleMessage = (event: MessageEvent) => {
    if (event.data?.channel !== 'solflareIframeToWalletAdapter') {
      return;
    }

    const data: SolflareIframeMessage = event.data.data || {};

    if (data.type === 'event') {
      this._handleEvent(data.event);
    } else if (data.type === 'resize') {
      this._handleResize(data);
    } else if (data.type === 'response') {
      if (this._messageHandlers[data.id]) {
        const { resolve, reject } = this._messageHandlers[data.id];

        delete this._messageHandlers[data.id];

        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.result);
        }
      }
    }
  };

  private _removeElement = () => {
    if (this._element) {
      this._element.remove();
      this._element = null;
    }
  };

  private _removeDanglingElements = () => {
    const elements = document.getElementsByClassName('solflare-metamask-wallet-adapter-iframe');
    for (const element of elements) {
      if (element.parentElement) {
        element.remove();
      }
    }
  };

  private _injectElement = () => {
    this._removeElement();
    this._removeDanglingElements();

    const network = encodeURIComponent(this._network);
    const origin = encodeURIComponent(window.location.origin);

    const iframeUrl = `${Solflare.IFRAME_URL}?cluster=${network}&origin=${origin}`;

    this._element = document.createElement('div');
    this._element.className = 'solflare-metamask-wallet-adapter-iframe';
    this._element.innerHTML = `
      <iframe src='${iframeUrl}' style='position: fixed; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: 100%; border: none; border-radius: 0; z-index: 99999; color-scheme: auto;' allowtransparency='true'></iframe>
    `;
    document.body.appendChild(this._element);
    this._iframe = this._element.querySelector('iframe');

    window.addEventListener('message', this._handleMessage, false);
  };

  private _collapseIframe = () => {
    if (this._iframe) {
      this._iframe.style.top = '';
      this._iframe.style.right = '';
      this._iframe.style.height = '2px';
      this._iframe.style.width = '2px';
    }
  };

  private _expandIframe = () => {
    if (this._iframe) {
      this._iframe.style.top = '0px';
      this._iframe.style.bottom = '0px';
      this._iframe.style.left = '0px';
      this._iframe.style.right = '0px';
      this._iframe.style.width = '100%';
      this._iframe.style.height = '100%';
    }
  };

  private _resizeIframe = (params: SolflareIframeResizeCoordinates) => {
    if (!this._iframe) {
      return;
    }
    this._iframe.style.top = isFinite(params.top as number) ? `${params.top}px` : '';
    this._iframe.style.bottom = isFinite(params.bottom as number) ? `${params.bottom}px` : '';
    this._iframe.style.left = isFinite(params.left as number) ? `${params.left}px` : '';
    this._iframe.style.right = isFinite(params.right as number) ? `${params.right}px` : '';
    this._iframe.style.width = isFinite(params.width as number)
      ? `${params.width}px`
      : (params.width as string);
    this._iframe.style.height = isFinite(params.height as number)
      ? `${params.height}px`
      : (params.height as string);
  };

  private _sendIframeMessage = (data: SolflareIframeRequest) => {
    if (!this.connected || !this.publicKey) {
      throw new Error('Wallet not connected');
    }

    return new Promise((resolve, reject) => {
      const messageId = uuidv4();

      this._messageHandlers[messageId] = { resolve, reject };

      this._iframe?.contentWindow?.postMessage(
        {
          channel: 'solflareWalletAdapterToIframe',
          data: { id: messageId, ...data }
        },
        '*'
      );
    });
  };

  private _disconnected = () => {
    this._publicKey = null;
    this._isConnected = false;
    window.removeEventListener('message', this._handleMessage, false);
    this._removeElement();
  };
}