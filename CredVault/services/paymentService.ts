import * as web3 from '@solana/web3.js';
import { Transaction, Connection, PublicKey, Keypair } from '@solana/web3.js';
import { sendAndConfirmTransaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token';

// Payment related types
export interface PaymentParams {
  recipient: PublicKey;
  amount: number;
  splToken?: PublicKey; // Optional - if not provided, uses SOL
}

export interface MintFeePayment {
  issuer: PublicKey;
  mintFee: number; // in SOL
}

export interface VerificationFeePayment {
  employer: PublicKey;
  candidatePublicKey: PublicKey;
  verificationFee: number; // in SOL or USDC
}

// Payment service class
export class PaymentService {
  private connection: Connection;
  private programId: PublicKey;

  constructor(connection: Connection, programId: PublicKey) {
    this.connection = connection;
    this.programId = programId;
  }

  // Function to process mint fee payment
  async processMintFeePayment(params: MintFeePayment, payer: Keypair): Promise<string> {
    try {
      // In a real implementation, this would create a transaction to send the mint fee
      // For now, we'll simulate the transaction
      const transaction = new Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: payer.publicKey,
          toPubkey: this.programId, // In reality, this would go to a fee collection account
          lamports: params.mintFee * web3.LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [payer]
      );

      return signature;
    } catch (error) {
      console.error('Error processing mint fee payment:', error);
      throw error;
    }
  }

  // Function to process verification fee payment
  async processVerificationFeePayment(params: VerificationFeePayment, payer: Keypair): Promise<string> {
    try {
      // In a real implementation, this would create a transaction to send the verification fee
      const transaction = new Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: payer.publicKey,
          toPubkey: this.programId, // In reality, this would go to a fee collection account
          lamports: params.verificationFee * web3.LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [payer]
      );

      return signature;
    } catch (error) {
      console.error('Error processing verification fee payment:', error);
      throw error;
    }
  }

  // Function to generate Solana Pay URI
  generateSolanaPayUri(recipient: PublicKey, amount: number, reference?: PublicKey, label?: string, message?: string, memo?: string): string {
    const url = new URL('https://solana.com/pay');
    url.searchParams.set('recipient', recipient.toBase58());
    url.searchParams.set('amount', amount.toString());
    
    if (reference) url.searchParams.set('reference', reference.toBase58());
    if (label) url.searchParams.set('label', label);
    if (message) url.searchParams.set('message', message);
    if (memo) url.searchParams.set('memo', memo);

    return url.toString();
  }

  // Function to create a payment transaction
  async createPaymentTransaction(params: PaymentParams, payer: PublicKey): Promise<Transaction> {
    const transaction = new Transaction();

    if (params.splToken) {
      // Create payment with SPL token
      const payerTokenAccount = await getAssociatedTokenAddress(
        params.splToken!,
        payer,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      
      const recipientTokenAccount = await getAssociatedTokenAddress(
        params.splToken!,
        params.recipient,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      transaction.add(createTransferInstruction(
        payerTokenAccount,
        recipientTokenAccount,
        payer,
        params.amount * 1_000_000,
        [],
        TOKEN_PROGRAM_ID
      ));
    } else {
      // Create payment with SOL
      transaction.add(web3.SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: params.recipient,
        lamports: params.amount * web3.LAMPORTS_PER_SOL,
      }));
    }

    return transaction;
  }
}

// Example usage functions
export const solanaPayService = new PaymentService(
  new Connection('https://api.devnet.solana.com'),
  new PublicKey(process.env.NEXT_PUBLIC_CREDVAULT_PROGRAM_ID!)
);