export type CredVault = {
  version: "0.1.0";
  name: "credVault";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "credentialAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "bump";
          type: "u8";
        }
      ];
    },
    {
      name: "issueCredential";
      accounts: [
        {
          name: "credentialAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "issuer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "credentialData";
          type: "string";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "CredentialAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "issuer";
            type: "publicKey";
          },
          {
            name: "credentialData";
            type: "string";
          },
          {
            name: "issuedAt";
            type: "i64";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    }
  ];
};

export const IDL: CredVault = {
  version: "0.1.0",
  name: "credVault",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "credentialAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "bump",
          type: "u8",
        },
      ],
    },
    {
      name: "issueCredential",
      accounts: [
        {
          name: "credentialAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "issuer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "credentialData",
          type: "string",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "CredentialAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "issuer",
            type: "publicKey",
          },
          {
            name: "credentialData",
            type: "string",
          },
          {
            name: "issuedAt",
            type: "i64",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
  ],
};