import type { NextPage } from 'next';
import Head from 'next/head';
import { useAuth } from '../components/AuthProvider';
import { WalletConnection } from '../components/WalletConnection';
import { useEffect, useState } from 'react';
import { VerificationLevel } from '../lib/credentialSchema';
import Header from '../components/Header';
import headerStyles from '../styles/Header.module.css';

const Profile: NextPage = () => {
  const { user, getUserProfile, updateUserProfile, refreshUserProfile } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.publicKey) {
        const profileData = await getUserProfile();
        setProfile(profileData);
        setEditData({
          displayName: profileData?.displayName || '',
          bio: profileData?.bio || '',
          location: profileData?.location || '',
          website: profileData?.website || '',
          twitter: profileData?.twitter || '',
          github: profileData?.github || '',
        });
      }
    };

    fetchProfile();
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const success = await updateUserProfile(editData);
    if (success) {
      setIsEditing(false);
      await refreshUserProfile();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset edit data to current profile data
    if (profile) {
      setEditData({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        twitter: profile.twitter || '',
        github: profile.github || '',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return (
      <div className={headerStyles['profile-container']}>
        <Head>
          <title>CredVault - Profile</title>
          <meta name="description" content="User profile for CredVault" />
        </Head>
        
        <Header />
        
        <main className={headerStyles['profile-content']}>
          <h1>Profile</h1>
          <p>Please connect your wallet to view your profile.</p>
          <WalletConnection />
        </main>
      </div>
    );
  }

  return (
    <div className={headerStyles['profile-container']}>
      <Head>
        <title>CredVault - Profile</title>
        <meta name="description" content="User profile for CredVault" />
      </Head>

      <Header />

      <main className={headerStyles['profile-content']}>
        {profile ? (
          <div>
            <div className={headerStyles['profile-header']}>
              <div className={headerStyles.avatar}> {/* Placeholder for avatar */ }
                <div className={headerStyles['avatar-placeholder']}>👤</div>
              </div>
              <div className={headerStyles['profile-info']}>
                <h2>
                  {isEditing ? (
                    <input
                      type="text"
                      name="displayName"
                      value={editData.displayName}
                      onChange={handleChange}
                      className={headerStyles['profile-input']}
                    />
                  ) : (
                    profile.displayName
                  )}
                </h2>
                <div className={headerStyles['verification-level']}>
                  Verification Level: {VerificationLevel[profile.verificationLevel]}
                </div>
                <p className={headerStyles['public-key']}>Public Key: {user.publicKey?.toString()}</p>
              </div>
              <div className={headerStyles['edit-button']}>
                {!isEditing && (
                  <button onClick={handleEdit} className={headerStyles['edit-btn']}>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className={headerStyles['profile-edit-form']}>
                <div className={headerStyles['form-group']}>
                  <label htmlFor="bio">Bio:</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={editData.bio}
                    onChange={handleChange}
                    className={headerStyles['profile-textarea']}
                  />
                </div>
                
                <div className={headerStyles['form-group']}>
                  <label htmlFor="location">Location:</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={editData.location}
                    onChange={handleChange}
                    className={headerStyles['profile-input']}
                  />
                </div>
                
                <div className={headerStyles['form-group']}>
                  <label htmlFor="website">Website:</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={editData.website}
                    onChange={handleChange}
                    className={headerStyles['profile-input']}
                  />
                </div>
                
                <div className={headerStyles['form-group']}>
                  <label htmlFor="twitter">Twitter:</label>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={editData.twitter}
                    onChange={handleChange}
                    className={headerStyles['profile-input']}
                  />
                </div>
                
                <div className={headerStyles['form-group']}>
                  <label htmlFor="github">GitHub:</label>
                  <input
                    type="text"
                    id="github"
                    name="github"
                    value={editData.github}
                    onChange={handleChange}
                    className={headerStyles['profile-input']}
                  />
                </div>

                <div className={headerStyles['form-actions']}>
                  <button onClick={handleSave} className={headerStyles['save-btn']}>Save</button>
                  <button onClick={handleCancel} className={headerStyles['cancel-btn']}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className={headerStyles['profile-details']}>
                <div className={headerStyles['detail-group']}>
                  <h3>Bio</h3>
                  <p>{profile.bio || 'Add a bio to tell others about yourself.'}</p>
                </div>
                
                <div className={headerStyles['detail-group']}>
                  <h3>Location</h3>
                  <p>{profile.location || 'Not specified'}</p>
                </div>
                
                <div className={headerStyles['detail-group']}>
                  <h3>Website</h3>
                  <p>
                    {profile.website ? (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer">
                        {profile.website}
                      </a>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                </div>
                
                <div className={headerStyles['detail-group']}>
                  <h3>Social Links</h3>
                  <div className={headerStyles['social-links']}>
                    {profile.twitter && (
                      <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer">
                        Twitter: @{profile.twitter}
                      </a>
                    )}
                    {profile.github && (
                      <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer">
                        GitHub: {profile.github}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className={headerStyles['credentials-section']}>
              <h3>Your Credentials</h3>
              <p>You have {profile.credentials?.length || 0} credentials.</p>
              {/* This section would list user's credentials */}
            </div>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </main>
    </div>
  );
};

export default Profile;