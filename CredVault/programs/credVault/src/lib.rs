use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount, MintTo};
use mpl_token_metadata::types::DataV2;
use mpl_token_metadata::instructions::{
    CreateMetadataAccountV3Cpi, 
    CreateMetadataAccountV3InstructionArgs,
    CreateMasterEditionV3Cpi,
    CreateMasterEditionV3InstructionArgs,
    UpdateMetadataAccountsV2Cpi,
    UpdateMetadataAccountsV2InstructionArgs
};
use anchor_lang::solana_program::program_pack::Pack;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod credVault {
    use super::*;

    // Initialize an issuer account
    pub fn initialize_issuer(ctx: Context<InitializeIssuer>, bump: u8) -> Result<()> {
        let issuer_account = &mut ctx.accounts.issuer_account;
        issuer_account.issuer_pubkey = ctx.accounts.authority.key();
        issuer_account.bump = bump;
        issuer_account.is_verified = false; // Needs admin verification
        issuer_account.created_at = Clock::get()?.unix_timestamp;
        
        Ok(())
    }

    // Mint a credential SBT to a student
    pub fn mint_credential(
        ctx: Context<MintCredential>,
        skill_name: String,
        issue_date: i64,
        credential_uri: String,
    ) -> Result<()> {
        let credential_account = &mut ctx.accounts.credential_account;
        credential_account.issuer_pubkey = ctx.accounts.issuer.issuer_pubkey;
        credential_account.student_pubkey = ctx.accounts.student.key();
        credential_account.skill_name = skill_name;
        credential_account.issue_date = issue_date;
        credential_account.credential_uri = credential_uri;
        credential_account.is_soulbound = true; // Mark as non-transferable
        credential_account.is_revoked = false; // Initially not revoked
        credential_account.created_at = Clock::get()?.unix_timestamp;
        credential_account.bump = *ctx.bumps.get("credential_account").unwrap();

        // Verify the issuer is verified
        require!(
            ctx.accounts.issuer.is_verified,
            CredVaultError::IssuerNotVerified
        );

        // Verify that the issuer signing the transaction is the same as the verified issuer account
        require!(
            ctx.accounts.issuer_account.key() == ctx.accounts.issuer.key(),
            CredVaultError::UnauthorizedIssuer
        );

        // Create the NFT token for the credential
        let mint = &ctx.accounts.credential_mint;
        let token_program = &ctx.accounts.token_program;
        let metadata_program = &ctx.accounts.metadata_program;
        let token_metadata = &mut ctx.accounts.token_metadata;
        let payer = &ctx.accounts.issuer_account;
        let system_program = &ctx.accounts.system_program;
        let rent = &ctx.accounts.rent;

        // Create the metadata account
        CreateMetadataAccountV3Cpi {
            metadata: token_metadata.to_account_info().into(),
            mint: mint.to_account_info().into(),
            mint_authority: payer.to_account_info().into(),
            payer: payer.to_account_info().into(),
            update_authority: (payer.to_account_info().clone(), true.into()),
            system_program: system_program.to_account_info().into(),
            rent: rent.to_account_info().into(),
        }
        .invoke(&CreateMetadataAccountV3InstructionArgs {
            data: anchor_lang::solana_program::program_pack::Pack::pack(
                &mpl_token_metadata::state::DataV2 {
                    name: ctx.accounts.credential_account.skill_name.clone(),
                    symbol: "CRED".to_string(),
                    uri: ctx.accounts.credential_account.credential_uri.clone(),
                    seller_fee_basis_points: 0, // No resale rights
                    creators: None,
                    collection: None,
                    uses: None,
                },
            )?,
            is_mutable: false, // Non-mutable to maintain credential integrity
            collection_details: None,
        })?;

        // Create the master edition account to make it non-transferable (Soulbound)
        let master_edition = &mut ctx.accounts.master_edition;
        CreateMasterEditionV3Cpi {
            edition: master_edition.to_account_info().into(),
            mint: mint.to_account_info().into(),
            update_authority: payer.to_account_info().into(),
            mint_authority: payer.to_account_info().into(),
            payer: payer.to_account_info().into(),
            metadata: token_metadata.to_account_info().into(),
            token_program: token_program.to_account_info().into(),
            system_program: system_program.to_account_info().into(),
            rent: rent.to_account_info().into(),
        }
        .invoke(&CreateMasterEditionV3InstructionArgs {
            max_supply: Some(0), // No supply means it's unique
        })?;

        // Mint one token to the student's token account (though it's soulbound, this creates the token)
        let cpi_accounts = MintTo {
            mint: ctx.accounts.credential_mint.to_account_info(),
            to: ctx.accounts.credential_token_account.to_account_info(),
            authority: ctx.accounts.issuer_account.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        anchor_spl::token::mint_to(cpi_ctx, 1)?;

        msg!("Credential minted successfully!");

        Ok(())
    }

    // Mint a proof-of-work NFT for completed projects or hackathon work
    pub fn mint_proof_of_work(
        ctx: Context<MintProofOfWork>,
        project_title: String,
        project_description: String,
        github_link: String,
        demo_link: String,
    ) -> Result<()> {
        let proof_of_work_account = &mut ctx.accounts.proof_of_work_account;
        proof_of_work_account.student_pubkey = ctx.accounts.student.key();
        proof_of_work_account.project_title = project_title.clone();
        proof_of_work_account.project_description = project_description;
        proof_of_work_account.github_link = github_link;
        proof_of_work_account.demo_link = demo_link;
        proof_of_work_account.timestamp = Clock::get()?.unix_timestamp;
        proof_of_work_account.is_transferable = true; // Unlike SBTs, these can be transferred
        proof_of_work_account.created_at = Clock::get()?.unix_timestamp;
        proof_of_work_account.bump = *ctx.bumps.get("proof_of_work_account").unwrap();

        // Create the NFT token for the proof of work
        let mint = &ctx.accounts.proof_of_work_mint;
        let token_program = &ctx.accounts.token_program;
        let metadata_program = &ctx.accounts.metadata_program;
        let token_metadata = &mut ctx.accounts.token_metadata;
        let payer = &ctx.accounts.student; // Student pays for and owns this NFT
        let system_program = &ctx.accounts.system_program;
        let rent = &ctx.accounts.rent;

        // Create the metadata account
        CreateMetadataAccountV3Cpi {
            metadata: token_metadata.to_account_info().into(),
            mint: mint.to_account_info().into(),
            mint_authority: payer.to_account_info().into(),
            payer: payer.to_account_info().into(),
            update_authority: (payer.to_account_info().clone(), true.into()),
            system_program: system_program.to_account_info().into(),
            rent: rent.to_account_info().into(),
        }
        .invoke(&CreateMetadataAccountV3InstructionArgs {
            data: anchor_lang::solana_program::program_pack::Pack::pack(
                &mpl_token_metadata::state::DataV2 {
                    name: proof_of_work_account.project_title.clone(),
                    symbol: "POW".to_string(), // Proof of Work token
                    uri: format!("https://arweave.net/{}", generate_proof_of_work_metadata_uri(&proof_of_work_account.project_title, proof_of_work_account.student_pubkey)), // In a real implementation, this would be an actual IPFS or Arweave link
                    seller_fee_basis_points: 500, // 5% royalty for the creator
                    creators: None,
                    collection: None,
                    uses: None,
                },
            )?,
            is_mutable: true, // Allow updates to metadata if needed
            collection_details: None,
        })?;

        // Create the master edition account - this is what makes it a proper NFT, but it's transferable
        let master_edition = &mut ctx.accounts.master_edition;
        CreateMasterEditionV3Cpi {
            edition: master_edition.to_account_info().into(),
            mint: mint.to_account_info().into(),
            update_authority: payer.to_account_info().into(),
            mint_authority: payer.to_account_info().into(),
            payer: payer.to_account_info().into(),
            metadata: token_metadata.to_account_info().into(),
            token_program: token_program.to_account_info().into(),
            system_program: system_program.to_account_info().into(),
            rent: rent.to_account_info().into(),
        }
        .invoke(&CreateMasterEditionV3InstructionArgs {
            max_supply: Some(0), // This makes it a one-of-a-kind NFT, but still transferable
        })?;

        // Mint one token to the student's token account
        let cpi_accounts = MintTo {
            mint: ctx.accounts.proof_of_work_mint.to_account_info(),
            to: ctx.accounts.proof_of_work_token_account.to_account_info(),
            authority: ctx.accounts.student.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        anchor_spl::token::mint_to(cpi_ctx, 1)?;

        msg!("Proof of Work NFT minted successfully for project: {}", proof_of_work_account.project_title);

        Ok(())
    }

    // Verify a credential
    pub fn verify_credential(ctx: Context<VerifyCredential>) -> Result<bool> {
        let credential = &ctx.accounts.credential_account;
        
        // Check if credential exists and is valid
        let is_valid = !credential.is_revoked && credential.created_at > 0;
        
        msg!("Credential verification result: {}", is_valid);
        Ok(is_valid)
    }

    // Verify a proof-of-work NFT
    pub fn verify_proof_of_work(ctx: Context<VerifyProofOfWork>) -> Result<bool> {
        let proof_of_work = &ctx.accounts.proof_of_work_account;
        
        // Check if proof of work exists and is valid
        let is_valid = proof_of_work.created_at > 0;
        
        msg!("Proof of Work verification result: {}", is_valid);
        Ok(is_valid)
    }

    // Update credential metadata (issuer only)
    pub fn update_metadata(
        ctx: Context<UpdateMetadata>,
        new_skill_name: Option<String>,
        new_credential_uri: Option<String>,
    ) -> Result<()> {
        let credential_account = &mut ctx.accounts.credential_account;

        // Verify this is called by the original issuer
        require!(
            ctx.accounts.issuer.key() == credential_account.issuer_pubkey,
            CredVaultError::UnauthorizedIssuer
        );

        // Update fields if provided
        if let Some(skill_name) = new_skill_name {
            credential_account.skill_name = skill_name;
        }
        
        if let Some(credential_uri) = new_credential_uri {
            credential_account.credential_uri = credential_uri;
        }

        // Update metadata on-chain as well using metaplex
        let token_metadata = &mut ctx.accounts.token_metadata;
        let update_authority = &ctx.accounts.issuer_account;

        UpdateMetadataAccountsV2Cpi {
            metadata: token_metadata.to_account_info().into(),
            update_authority: update_authority.to_account_info().into(),
            system_program: ctx.accounts.system_program.to_account_info().into(),
        }
        .invoke(&UpdateMetadataAccountsV2InstructionArgs {
            new_update_authority: None,
            data: Some(anchor_lang::solana_program::program_pack::Pack::pack(
                &mpl_token_metadata::state::DataV2 {
                    name: credential_account.skill_name.clone(),
                    symbol: "CRED".to_string(),
                    uri: credential_account.credential_uri.clone(),
                    seller_fee_basis_points: 0,
                    creators: None,
                    collection: None,
                    uses: None,
                },
            )?),
            primary_sale_happened: None,
            is_mutable: false, // Keep it immutable
        })?;

        msg!("Metadata updated successfully!");
        Ok(())
    }

    // Update proof-of-work metadata (student only)
    pub fn update_proof_of_work_metadata(
        ctx: Context<UpdateProofOfWorkMetadata>,
        new_project_title: Option<String>,
        new_project_description: Option<String>,
        new_github_link: Option<String>,
        new_demo_link: Option<String>,
    ) -> Result<()> {
        let proof_of_work_account = &mut ctx.accounts.proof_of_work_account;

        // Verify this is called by the original owner
        require!(
            ctx.accounts.student.key() == proof_of_work_account.student_pubkey,
            CredVaultError::UnauthorizedUpdate
        );

        // Update fields if provided
        if let Some(title) = new_project_title {
            proof_of_work_account.project_title = title;
        }
        
        if let Some(description) = new_project_description {
            proof_of_work_account.project_description = description;
        }
        
        if let Some(github) = new_github_link {
            proof_of_work_account.github_link = github;
        }
        
        if let Some(demo) = new_demo_link {
            proof_of_work_account.demo_link = demo;
        }

        // Update metadata on-chain as well using metaplex
        let token_metadata = &mut ctx.accounts.token_metadata;
        let update_authority = &ctx.accounts.student;

        UpdateMetadataAccountsV2Cpi {
            metadata: token_metadata.to_account_info().into(),
            update_authority: update_authority.to_account_info().into(),
            system_program: ctx.accounts.system_program.to_account_info().into(),
        }
        .invoke(&UpdateMetadataAccountsV2InstructionArgs {
            new_update_authority: None,
            data: Some(anchor_lang::solana_program::program_pack::Pack::pack(
                &mpl_token_metadata::state::DataV2 {
                    name: proof_of_work_account.project_title.clone(),
                    symbol: "POW".to_string(),
                    uri: format!("https://arweave.net/{}", generate_proof_of_work_metadata_uri(&proof_of_work_account.project_title, proof_of_work_account.student_pubkey)),
                    seller_fee_basis_points: 500,
                    creators: None,
                    collection: None,
                    uses: None,
                },
            )?),
            primary_sale_happened: None,
            is_mutable: true, // Allow updates
        })?;

        msg!("Proof of Work metadata updated successfully!");
        Ok(())
    }

    // Revoke a credential (issuer only)
    pub fn revoke_credential(ctx: Context<RevokeCredential>) -> Result<()> {
        let credential_account = &mut ctx.accounts.credential_account;

        // Verify this is called by the original issuer
        require!(
            ctx.accounts.issuer.key() == credential_account.issuer_pubkey,
            CredVaultError::UnauthorizedIssuer
        );

        // Mark as revoked
        credential_account.is_revoked = true;
        credential_account.revoked_at = Some(Clock::get()?.unix_timestamp);

        msg!("Credential revoked successfully!");
        Ok(())
    }
}

// Helper function to generate metadata URI for proof of work
fn generate_proof_of_work_metadata_uri(title: &str, student_pubkey: Pubkey) -> String {
    // In a real implementation, this would create a proper IPFS or Arweave hash
    // For this example, we'll just return a placeholder
    format!("{}-{}", title.replace(" ", "-"), student_pubkey.to_string()[..8].to_lowercase())
}

// Account definitions
#[account]
pub struct IssuerAccount {
    pub issuer_pubkey: Pubkey,
    pub bump: u8,
    pub is_verified: bool,
    pub created_at: i64,
}

#[account]
pub struct CredentialAccount {
    pub issuer_pubkey: Pubkey,
    pub student_pubkey: Pubkey,
    pub skill_name: String,
    pub issue_date: i64,
    pub credential_uri: String,
    pub is_soulbound: bool, // Non-transferable flag
    pub is_revoked: bool,
    pub created_at: i64,
    pub revoked_at: Option<i64>,
    pub bump: u8,
}

#[account]
pub struct ProofOfWorkAccount {
    pub student_pubkey: Pubkey,
    pub project_title: String,
    pub project_description: String,
    pub github_link: String,
    pub demo_link: String,
    pub timestamp: i64,
    pub is_transferable: bool, // Unlike SBTs, these can be transferred
    pub created_at: i64,
    pub bump: u8,
}

// Context structs
#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct InitializeIssuer<'info> {
    #[account(
        init,
        seeds = [b"issuer", authority.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + 32 + 1 + 1 + 8 // discriminator + pubkey + bump + is_verified + created_at
    )]
    pub issuer_account: Account<'info, IssuerAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintCredential<'info> {
    #[account(
        init,
        seeds = [b"credential", student.key().as_ref(), issuer.issuer_pubkey.as_ref(), skill_name.as_bytes()],
        bump,
        payer = issuer_account,
        space = 8 + 32 + 32 + 50 + 8 + 100 + 1 + 1 + 8 + 9 + 1 // discriminator + issuer + student + skill_name + issue_date + uri + soulbound + revoked + created_at + revoked_at + bump
    )]
    pub credential_account: Account<'info, CredentialAccount>,
    
    #[account(
        mut,
        seeds = [b"issuer", issuer_pubkey.key().as_ref()],
        bump = issuer.bump,
        constraint = issuer.issuer_pubkey == issuer_pubkey.key() @ CredVaultError::InvalidIssuerAccount,
        constraint = issuer.is_verified @ CredVaultError::IssuerNotVerified
    )]
    pub issuer: Account<'info, IssuerAccount>,
    
    #[account(mut)]
    pub issuer_pubkey: Signer<'info>, // The actual issuer account signing the transaction that matches the issuer account
    
    #[account(mut)]
    pub student: Signer<'info>,
    
    /// CHECK: We're creating this account
    #[account(
        mut,
        seeds = [b"metadata", credential_mint.key().as_ref()],
        bump,
        seeds::program = mpl_token_metadata::ID,
    )]
    pub token_metadata: AccountInfo<'info>,
    
    #[account(
        init,
        payer = issuer_pubkey,
        seeds = [b"mint", credential_account.key().as_ref()],
        bump,
        mint::decimals = 0,
        mint::freeze_authority = issuer_pubkey,
        mint::mint_authority = issuer_pubkey,
    )]
    pub credential_mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = issuer_pubkey,
        seeds = [b"token", credential_account.key().as_ref()],
        bump,
        token::mint = credential_mint,
        token::authority = issuer_pubkey,
    )]
    pub credential_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"master-edition", credential_mint.key().as_ref()],
        bump,
        seeds::program = mpl_token_metadata::ID,
    )]
    /// CHECK: We're creating this PDA
    pub master_edition: AccountInfo<'info>,
    
    pub metadata_program: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,
}

#[derive(Accounts)]
pub struct MintProofOfWork<'info> {
    #[account(
        init,
        seeds = [b"proof-of-work", student.key().as_ref(), project_title.as_bytes()],
        bump,
        payer = student,
        space = 8 + 32 + 100 + 500 + 200 + 200 + 8 + 1 + 8 + 1 // discriminator + student + title + description + github + demo + timestamp + is_transferable + created_at + bump
    )]
    pub proof_of_work_account: Account<'info, ProofOfWorkAccount>,
    
    #[account(mut)]
    pub student: Signer<'info>,
    
    /// CHECK: We're creating this account
    #[account(
        mut,
        seeds = [b"metadata", proof_of_work_mint.key().as_ref()],
        bump,
        seeds::program = mpl_token_metadata::ID,
    )]
    pub token_metadata: AccountInfo<'info>,
    
    #[account(
        init,
        payer = student,
        seeds = [b"mint", proof_of_work_account.key().as_ref()],
        bump,
        mint::decimals = 0,
        mint::freeze_authority = student,
        mint::mint_authority = student,
    )]
    pub proof_of_work_mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = student,
        seeds = [b"token", proof_of_work_account.key().as_ref()],
        bump,
        token::mint = proof_of_work_mint,
        token::authority = student,
    )]
    pub proof_of_work_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"master-edition", proof_of_work_mint.key().as_ref()],
        bump,
        seeds::program = mpl_token_metadata::ID,
    )]
    /// CHECK: We're creating this PDA
    pub master_edition: AccountInfo<'info>,
    
    pub metadata_program: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,
}

#[derive(Accounts)]
pub struct VerifyCredential<'info> {
    #[account(
        seeds = [b"credential", 
                credential_account.student_pubkey.as_ref(), 
                credential_account.issuer_pubkey.as_ref(), 
                get_skill_seed(&credential_account.skill_name)],
        bump = credential_account.bump
    )]
    pub credential_account: Account<'info, CredentialAccount>,
}

#[derive(Accounts)]
pub struct VerifyProofOfWork<'info> {
    #[account(
        seeds = [b"proof-of-work", 
                proof_of_work_account.student_pubkey.as_ref(), 
                get_proof_of_work_seed(&proof_of_work_account.project_title)],
        bump = proof_of_work_account.bump
    )]
    pub proof_of_work_account: Account<'info, ProofOfWorkAccount>,
}

#[derive(Accounts)]
pub struct UpdateMetadata<'info> {
    #[account(
        mut,
        seeds = [b"credential", 
                credential_account.student_pubkey.as_ref(), 
                credential_account.issuer_pubkey.as_ref(), 
                get_skill_seed(&credential_account.skill_name)],
        bump = credential_account.bump
    )]
    pub credential_account: Account<'info, CredentialAccount>,
    
    #[account(
        mut,
        constraint = issuer.key() == credential_account.issuer_pubkey @ CredVaultError::UnauthorizedIssuer
    )]
    pub issuer: Signer<'info>,
    
    /// CHECK: We're updating this account
    #[account(
        mut,
        seeds = [b"metadata", mint.key().as_ref()],
        bump,
        seeds::program = mpl_token_metadata::ID,
    )]
    pub token_metadata: AccountInfo<'info>,
    
    #[account(
        mut,
        seeds = [b"mint", credential_account.key().as_ref()],
        bump
    )]
    pub mint: Account<'info, Mint>,
    
    pub metadata_program: Program<'info, Metadata>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateProofOfWorkMetadata<'info> {
    #[account(
        mut,
        seeds = [b"proof-of-work", 
                proof_of_work_account.student_pubkey.as_ref(), 
                get_proof_of_work_seed(&proof_of_work_account.project_title)],
        bump = proof_of_work_account.bump
    )]
    pub proof_of_work_account: Account<'info, ProofOfWorkAccount>,
    
    #[account(
        mut,
        constraint = student.key() == proof_of_work_account.student_pubkey @ CredVaultError::UnauthorizedUpdate
    )]
    pub student: Signer<'info>,
    
    /// CHECK: We're updating this account
    #[account(
        mut,
        seeds = [b"metadata", mint.key().as_ref()],
        bump,
        seeds::program = mpl_token_metadata::ID,
    )]
    pub token_metadata: AccountInfo<'info>,
    
    #[account(
        mut,
        seeds = [b"mint", proof_of_work_account.key().as_ref()],
        bump
    )]
    pub mint: Account<'info, Mint>,
    
    pub metadata_program: Program<'info, Metadata>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RevokeCredential<'info> {
    #[account(
        mut,
        seeds = [b"credential", 
                credential_account.student_pubkey.as_ref(), 
                credential_account.issuer_pubkey.as_ref(), 
                get_skill_seed(&credential_account.skill_name)],
        bump = credential_account.bump
    )]
    pub credential_account: Account<'info, CredentialAccount>,
    
    #[account(
        mut,
        constraint = issuer.key() == credential_account.issuer_pubkey @ CredVaultError::UnauthorizedIssuer
    )]
    pub issuer: Signer<'info>, // The issuer trying to revoke
}

// Helper function to create seed from skill name
fn get_skill_seed(skill_name: &str) -> &[u8] {
    // Limit the length of the skill name to ensure it fits in the seed
    if skill_name.len() > 32 {
        &skill_name.as_bytes()[..32]
    } else {
        skill_name.as_bytes()
    }
}

// Helper function to create seed from project title
fn get_proof_of_work_seed(project_title: &str) -> &[u8] {
    // Limit the length of the project title to ensure it fits in the seed
    if project_title.len() > 32 {
        &project_title.as_bytes()[..32]
    } else {
        project_title.as_bytes()
    }
}

// Custom errors
#[error_code]
pub enum CredVaultError {
    #[msg("Issuer is not verified")]
    IssuerNotVerified,
    #[msg("Only the original issuer can perform this action")]
    UnauthorizedIssuer,
    #[msg("Credential has been revoked")]
    CredentialRevoked,
    #[msg("Credential is not soulbound")]
    NotSoulbound,
    #[msg("Only the owner can update this")]
    UnauthorizedUpdate,
    #[msg("Invalid issuer account provided")]
    InvalidIssuerAccount,
}