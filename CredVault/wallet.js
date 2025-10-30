// wallet.js - Solana Wallet Integration

// Wallet connection state
let wallet = null;
let provider = null;
let connectedAccount = null;

// Initialize wallet connection
async function initializeWallet() {
    // Check if Solana object exists (Phantom, Solflare, etc.)
    if (typeof window.solana !== 'undefined' && window.solana.isPhantom) {
        provider = window.solana;
        console.log('Phantom wallet detected');
    } 
    // Check for other wallet providers
    else if (typeof window.solana !== 'undefined') {
        // Other wallet providers like Solflare, etc.
        provider = window.solana;
        console.log('Solana compatible wallet detected');
    } else {
        console.log('No Solana wallet detected');
        showWalletModal();
        return;
    }

    // Check if we're already connected
    if (provider && provider.isConnected) {
        connectedAccount = provider.publicKey;
        updateWalletUI(true, connectedAccount.toBase58());
    }
}

// Connect to wallet
async function connectWallet() {
    if (!provider) {
        showWalletModal();
        return;
    }

    try {
        // Request wallet connection
        const response = await provider.connect();
        connectedAccount = response.publicKey;
        
        // Update UI
        updateWalletUI(true, connectedAccount.toBase58());
        
        // Save connection to localStorage
        localStorage.setItem('solanaConnected', 'true');
        localStorage.setItem('solanaPublicKey', connectedAccount.toBase58());
        
        console.log('Connected to wallet:', connectedAccount.toBase58());
        return connectedAccount.toBase58();
    } catch (err) {
        console.error('Wallet connection error:', err);
        if (err.message.includes('user rejected')) {
            console.log('User rejected the connection');
        } else {
            alert('Failed to connect wallet: ' + err.message);
        }
        return null;
    }
}

// Disconnect from wallet
async function disconnectWallet() {
    if (provider) {
        try {
            await provider.disconnect();
        } catch (err) {
            console.error('Disconnect error:', err);
        }
    }
    
    connectedAccount = null;
    
    // Update UI
    updateWalletUI(false, null);
    
    // Clear localStorage
    localStorage.removeItem('solanaConnected');
    localStorage.removeItem('solanaPublicKey');
    
    console.log('Disconnected from wallet');
}

// Update the UI based on connection status
function updateWalletUI(connected, publicKey) {
    const connectBtn = document.getElementById('connectWalletButton');
    const walletInfo = document.getElementById('wallet-info');
    const walletAddress = document.getElementById('wallet-address');
    
    if (connectBtn) {
        connectBtn.style.display = connected ? 'none' : 'inline-block';
    }
    
    if (walletInfo) {
        walletInfo.style.display = connected ? 'flex' : 'none';
        walletInfo.style.alignItems = 'center';
    }
    
    if (walletAddress && publicKey) {
        // Truncate the public key for display
        const truncatedKey = `${publicKey.substring(0, 4)}...${publicKey.substring(publicKey.length - 4)}`;
        walletAddress.textContent = truncatedKey;
    }
}

// Show wallet selection modal
function showWalletModal() {
    // Create modal HTML
    const modal = document.createElement('div');
    modal.id = 'wallet-modal';
    modal.innerHTML = `
        <div id="wallet-modal-overlay" style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        "></div>
        <div id="wallet-modal-content" style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1E293B;
            border-radius: 12px;
            padding: 1.5rem;
            z-index: 10001;
            min-width: 350px;
            border: 1px solid rgba(148, 163, 184, 0.1);
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="color: #F1F5F9; margin: 0;">Connect Wallet</h3>
                <button id="close-wallet-modal" style="
                    background: none;
                    border: none;
                    color: #94A3B8;
                    font-size: 1.5rem;
                    cursor: pointer;
                ">&times;</button>
            </div>
            <div id="wallet-options" style="display: flex; flex-direction: column; gap: 0.75rem;">
                <button id="phantom-wallet" class="wallet-option" data-wallet="phantom" style="
                    background: #1E293B;
                    border: 1px solid #475569;
                    border-radius: 8px;
                    padding: 1rem;
                    color: #F1F5F9;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    cursor: pointer;
                    text-align: left;
                ">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDQiIGhlaWdodD0iNDQiIHZpZXdCb3g9IjAgMCA0NCA0NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ0IiBoZWlnaHQ9IjQ0IiByeD0iOCIgZmlsbD0iIzAwMCIvPgo8cGF0aCBkPSJNMTUgMTFIMTcuNUwxOS41IDE1TDIxLjUgMTFIMjRMMTkuNSAxN0wxNSAxMVoiIGZpbGw9IiNGRkYiLz4KPHBhdGggZD0iTTE1IDE3VjI3SDE3LjVMMTkuNSAyM0wyMS41IDI3SDI0VjE3SDIyLjVMMTkuNSAyMVYxN0gxNVoiIGZpbGw9IiNGRkYiLz4KPC9zdmc+Cg==" alt="Phantom" width="32" height="32" style="border-radius: 50%;">
                    <div>
                        <div style="font-weight: 600;">Phantom</div>
                        <div style="font-size: 0.875rem; color: #94A3B8;">Phantom wallet extension</div>
                    </div>
                </button>
                <button id="solflare-wallet" class="wallet-option" data-wallet="solflare" style="
                    background: #1E293B;
                    border: 1px solid #475569;
                    border-radius: 8px;
                    padding: 1rem;
                    color: #F1F5F9;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    cursor: pointer;
                    text-align: left;
                ">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDQiIGhlaWdodD0iNDQiIHZpZXdCb3g9IjAgMCA0NCA0NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ0IiBoZWlnaHQ9IjQ0IiByeD0iOCIgZmlsbD0iIzAwMCIvPgo8cGF0aCBkPSJNMTUgMTFIMTcuNUwxOS41IDE1TDIxLjUgMTFIMjRMMTkuNSAxN0wxNSAxMVoiIGZpbGw9IiNGRkYiLz4KPHBhdGggZD0iTTE1IDE3VjI3SDE3LjVMMTkuNSAyM0wyMS41IDI3SDI0VjE3SDIyLjVMMTkuNSAyMVYxN0gxNVoiIGZpbGw9IiNGRkYiLz4KPC9zdmc+Cg==" alt="Solflare" width="32" height="32" style="border-radius: 50%;">
                    <div>
                        <div style="font-weight: 600;">Solflare</div>
                        <div style="font-size: 0.875rem; color: #94A3B8;">Solflare wallet extension</div>
                    </div>
                </button>
                <button id="sollet-wallet" class="wallet-option" data-wallet="sollet" style="
                    background: #1E293B;
                    border: 1px solid #475569;
                    border-radius: 8px;
                    padding: 1rem;
                    color: #F1F5F9;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    cursor: pointer;
                    text-align: left;
                ">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDQiIGhlaWdodD0iNDQiIHZpZXdCb3g9IjAgMCA0NCA0NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ0IiBoZWlnaHQ9IjQ0IiByeD0iOCIgZmlsbD0iIzAwMCIvPgo8cGF0aCBkPSJNMTUgMTFIMTcuNUwxOS41IDE1TDIxLjUgMTFIMjRMMTkuNSAxN0wxNSAxMVoiIGZpbGw9IiNGRkYiLz4KPHBhdGggZD0iTTE1IDE3VjI3SDE3LjVMMTkuNSAyM0wyMS41IDI3SDI0VjE3SDIyLjVMMTkuNSAyMVYxN0gxNVoiIGZpbGw9IiNGRkYiLz4KPC9zdmc+Cg==" alt="Sollet" width="32" height="32" style="border-radius: 50%;">
                    <div>
                        <div style="font-weight: 600;">Sollet</div>
                        <div style="font-size: 0.875rem; color: #94A3B8;">Sollet web wallet</div>
                    </div>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    document.getElementById('close-wallet-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.getElementById('phantom-wallet').addEventListener('click', () => {
        // In a real implementation, we would connect to Phantom
        // For now, we'll just check if Phantom is available
        if (typeof window.solana !== 'undefined' && window.solana.isPhantom) {
            connectWallet();
            document.body.removeChild(modal);
        } else {
            alert('Please install Phantom wallet from https://phantom.app');
        }
    });
    
    document.getElementById('solflare-wallet').addEventListener('click', () => {
        // In a real implementation, we would connect to Solflare
        if (typeof window.solana !== 'undefined' && window.solana.isSolflare) {
            connectWallet();
            document.body.removeChild(modal);
        } else {
            alert('Please install Solflare wallet from https://solflare.com');
        }
    });
    
    // Click outside to close modal
    document.getElementById('wallet-modal-overlay').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Check for existing connection on page load
function checkExistingConnection() {
    const isConnected = localStorage.getItem('solanaConnected');
    const savedPublicKey = localStorage.getItem('solanaPublicKey');
    
    if (isConnected === 'true' && savedPublicKey) {
        // Try to connect to the same wallet
        initializeWallet();
    }
}

// Initialize wallet connection when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeWallet();
    checkExistingConnection();
    
    // Add event listeners to wallet buttons if they exist
    const connectBtn = document.getElementById('connectWalletButton');
    if (connectBtn) {
        connectBtn.addEventListener('click', connectWallet);
    }
    
    const disconnectBtn = document.getElementById('disconnectWalletButton');
    if (disconnectBtn) {
        disconnectBtn.addEventListener('click', disconnectWallet);
    }
});

// Function to get the connected wallet address (for use in other parts of the app)
function getConnectedWallet() {
    return connectedAccount ? connectedAccount.toBase58() : null;
}

// Function to check if wallet is connected
function isWalletConnected() {
    return connectedAccount !== null;
}

// Export functions for global use
window.solanaWallet = {
    connect: connectWallet,
    disconnect: disconnectWallet,
    getAddress: getConnectedWallet,
    isConnected: isWalletConnected,
    initialize: initializeWallet
};