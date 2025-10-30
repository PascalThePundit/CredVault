# CredVault - Decentralized Credentialing Platform

CredVault is a decentralized credentialing and employment network for Nigerian and African youth. The platform enables training organizations, hackathon programs, and employers to issue on-chain skill credentials and proof-of-work NFTs to users, helping skilled youths verify their achievements, showcase their work, and connect with global opportunities on Solana.

## 🚀 Features

- **Verifiable On-Chain Credentials**: Using Soulbound Tokens for non-transferable credentials
- **Proof-of-Work NFTs**: Transferable NFTs for completed projects and hackathon work
- **Employer Verification Dashboard**: For credential validation
- **Project Showcase**: Students can mint NFTs representing their completed projects
- **Smooth and Minimal UX**: Intuitive user experience
- **Solana Integration**: Optimized for the Solana blockchain
- **IPFS Storage**: Decentralized metadata storage

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Issuer        │    │                  │    │   Employer       │
│ (Training Org,  │    │                  │    │    /Verifier)    │
│ Hackathon,      │    │                  │    │                  │
│ Employer)       │    └─────────┬────────┘    └─────────┬────────┘
└─────────┬───────┘              │                      │
          │                ┌─────▼─────┐                │
         ┌▼─────────────────┤  CredVault│────────────────▼┐
         │                  │  Program  │                 │
         │                  └───────────┘                 │
         │                                                 │
         │                    ┌─────────┐                  │
         │                    │  IPFS   │                  │
         │                    │ Storage │                  │
         │                    └─────────┘                  │
         │         ┌─────────────────────────┐             │
         └─────────┤   Next.js Application   ├─────────────┘
                   └─────────────────────────┘
```

### User Roles:

1. **Issuer** (Training Organizations, Hackathons, Employers)
   - Can issue credentials to users
   - Has verified status on the platform

2. **Youth/User** (Learner)
   - Can receive credentials from issuers
   - Can showcase credentials in their profile

3. **Employer/Verifier**
   - Can verify credentials issued to users
   - Can access verified credential information

## 🛠️ Tech Stack

- **Blockchain**: Solana
- **Framework**: Anchor (Rust)
- **Frontend**: Next.js, React (TypeScript)
- **Wallet Integration**: Solana Wallet Adapter
- **Storage**: IPFS
- **Styling**: Tailwind CSS, CSS Modules

## 📁 Project Structure

```
CredVault/
├── programs/                    # Anchor programs
│   └── credVault/
│       ├── src/
│       │   └── lib.rs          # Main program logic
│       ├── Cargo.toml          # Program dependencies
│       └── Xargo.toml
├── app/                        # Next.js frontend
│   ├── public/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── lib/
├── migrations/
├── tests/
├── target/
├── Anchor.toml
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Solana CLI tools
- Anchor framework
- Rust and Cargo
- IPFS client (optional for local development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/niyabounty/credvault.git
cd credvault
```

2. Install Node.js dependencies:
```bash
cd app
npm install
```

3. Install Rust and Solana tools (if not already installed):
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana
sh -c "$(curl -sSfL https://release.solana.com/v1.16.12/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### Environment Variables

Create a `.env.local` file in the `app` directory:

```env
NEXT_PUBLIC_SOLANA_RPC_HOST=https://api.devnet.solana.com
NEXT_PUBLIC_CREDVAULT_PROGRAM_ID=your_program_id_here
NEXT_PUBLIC_IPFS_GATEWAY=https://cloudflare-ipfs.com
```

### Development

1. Start the Solana local validator:
```bash
solana-test-validator
```

2. In a new terminal, build and deploy the Anchor program:
```bash
anchor build
anchor deploy
```

3. Update the `NEXT_PUBLIC_CREDVAULT_PROGRAM_ID` in your `.env.local` with the deployed program ID

4. Start the Next.js development server:
```bash
cd app
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔐 Security Features

- **Soulbound Tokens**: Non-transferable credentials to prevent fraud
- **Multi-level Verification**: Multiple verification layers for credential authenticity
- **Decentralized Storage**: IPFS for credential metadata to prevent centralization risks
- **PDA-based Accounts**: Secure account ownership verification
- **On-chain Transparency**: Immutable credential records for trust
- **Role-based Access**: Granular permissions for different user types

## 📊 API Specification

For detailed API specifications, refer to the [API_SPEC.md](API_SPEC.md) document.

## 🛡️ Security Considerations

For security best practices and considerations, refer to the [SECURITY.md](SECURITY.md) document.

## 🚀 Deployment

For deployment instructions and infrastructure setup, refer to the [DEPLOYMENT.md](DEPLOYMENT.md) document.

## 📋 Implementation Plan

For the detailed implementation roadmap, refer to the [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) document.

## 👥 Contributing

We welcome contributions from the community! Please read our contributing guidelines before making any changes:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Community

Join our community to stay updated and get help:

- [GitHub Issues](https://github.com/niyabounty/credvault/issues) for bug reports and feature requests
- [Discord](https://discord.gg/your-invite) for community discussions

## 🙏 Acknowledgments

- Solana Foundation for the Solana blockchain
- Anchor framework for smart contract development
- IPFS for decentralized storage
- All contributors who make this project possible

---

Built with ❤️ for the African developer ecosystem