import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  setAuthToken,
  fetchUserProfile,
  authorizeShopify,
  authorizeGoogle,
} from "./ApiService";
import { gapi } from "gapi-script";

const googleClientId =
  "443299789075-30jr9vltuv4ct5lhk44jbi9pnsdovcfn.apps.googleusercontent.com";
const shopifyApiKey = "6f621fde7e6f62c5f45f1359c2f83c10";

type UserProfile = {
  id: number;
  name: string;
  email: string;
};

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [authSuccess, setAuthSuccess] = useState({
    google: localStorage.getItem("authSuccessGoogle") === "true",
    shopify: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        setAuthToken(token);
        const response = await fetchUserProfile();
        setUserProfile(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/login");
      }
    };

    const start = () => {
      gapi.client.init({
        clientId: googleClientId,
        scope: "https://www.googleapis.com/auth/spreadsheets",
      });
    };

    gapi.load("client:auth2", start);
    loadUserProfile();
  }, [navigate]);

  const handleGoogleAuthClick = () => {
    gapi.auth2
      .getAuthInstance()
      .grantOfflineAccess()
      .then((resp: { code: any }) => {
        const authCode = resp.code;
        authorizeGoogle(authCode)
          .then(() => {
            setAuthSuccess((prevState: any) => ({
              ...prevState,
              google: true,
            }));
            setShowSuccessPopup(true);
            localStorage.removeItem("authSuccessGoogle");
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
  };

  const handleShopifyAuthClick = () => {
    const shopName = "akshat16pandey";
    const authUrl = `https://${shopName}.myshopify.com/admin/oauth/authorize?client_id=${shopifyApiKey}&scope=read_inventory,write_inventory,read_products,write_products&redirect_uri=${encodeURIComponent(
      "http://localhost:5173/profile"
    )}&state=${Math.random().toString(36).substring(7)}&response_type=code`;

    window.location.href = authUrl;
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");
    const shopName = "akshat16pandey";
    if (code) {
      authorizeShopify(code, shopName)
        .then(() => {
          setAuthSuccess((prevState: any) => ({
            ...prevState,
            shopify: true,
          }));
          setShowSuccessPopup(true);
          setTimeout(() => {
            setShowSuccessPopup(false);
          }, 3000);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("authSuccessGoogle", authSuccess.google.toString());
  }, [authSuccess]);

  const handleNavigate = () => {
    if (authSuccess.google && authSuccess.shopify) {
      navigate("/addtosheet");
    }
  };

  const handleResetGoogleAuth = () => {
    setAuthSuccess((prevState: any) => ({
      ...prevState,
      google: false,
    }));
    localStorage.removeItem("authSuccessGoogle");
  };

  const handleResetShopifyAuth = () => {
    setAuthSuccess((prevState: any) => ({
      ...prevState,
      shopify: false,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-700 font-bold flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      {showSuccessPopup && (
        <div className="success-popup bg-green-500 text-white px-4 py-2 rounded-md mb-4">
          Authorization successful!
        </div>
      )}
      {loading ? (
        <p className="text-gray-200 font-bold text-6xl">Loading...</p>
      ) : userProfile ? (
        <div className="text-center mb-8">
          <div className="rounded-2xl bg-gray-100 border border-gray-600 p-6 mb-4">
            <h1 className="text-5xl text-gray-700 font-bold mb-5">Profile</h1>
            <p className="mb-2 text-gray-500 text-2xl">
              <strong>Id:</strong> {userProfile.id}
            </p>
            <p className="mb-2 text-gray-500 text-2xl">
              <strong>Name:</strong> {userProfile.name}
            </p>
            <p className="mb-2 text-gray-500 text-2xl">
              <strong>Email:</strong> {userProfile.email}
            </p>
            <div className="flex justify-center mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600"
                onClick={handleShopifyAuthClick}
              >
                {authSuccess.shopify
                  ? "Shopify Auth Completed"
                  : "Authorize Shopify"}
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-yellow-600"
                onClick={handleGoogleAuthClick}
              >
                {authSuccess.google
                  ? "Google Auth Completed"
                  : "Authorize Google Sheets"}
              </button>
              {authSuccess.google && authSuccess.shopify && (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  onClick={handleNavigate}
                >
                  Go to Next Page
                </button>
              )}
            </div>
          </div>
          <div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-red-600"
              onClick={handleResetShopifyAuth}
            >
              Reset Shopify Auth
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={handleResetGoogleAuth}
            >
              Reset Google Auth
            </button>
          </div>
        </div>
      ) : (
        <p>User profile not available.</p>
      )}
    </div>
  );
};

export default Profile;
