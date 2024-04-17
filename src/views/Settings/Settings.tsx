import React, { useState, useEffect } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { Base, Protected } from "../../Components";
import { trpc } from "../../utils/trpc";
import {
  Button,
  Spinner,
  Pane,
  majorScale,
  toaster,
  Switch,
  Dialog,
} from "evergreen-ui";

const ToggleSwitch: React.FC<{
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}> = ({ label, checked, onChange, disabled = false }) => (
  <Pane display="flex" alignItems="center" marginBottom={16}>
    <Switch
      checked={checked}
      onChange={onChange}
      marginRight={16}
      disabled={disabled}
    />
    <div className="font-medium text-gray-700">{label}</div>
  </Pane>
);

export const Settings: NextPage = () => {
  const {
    data: user,
    isLoading: isLoadingUser,
    refetch,
  } = trpc.user.getUser.useQuery();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  // State hooks for settings
  const [agreedToTermsAndCond, setAgreedToTermsAndCond] =
    useState<boolean>(false);
  const [forwardDataThirdParty, setForwardDataThirdParty] =
    useState<boolean>(false);
  const [subscribeNewsletterEmail, setSubscribeNewsletterEmail] =
    useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setAgreedToTermsAndCond(user.agreedToTermsAndCond);
      setForwardDataThirdParty(user.forwardDataThirdParty);
      setSubscribeNewsletterEmail(user.subscribeNewsletterEmail);
    }
  }, [user]);

  const updateConsentMutation = trpc.user.updateConsent.useMutation();
  const deleteUserMutation = trpc.user.deleteUserById.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingUpdate(true);

    await updateConsentMutation.mutateAsync(
      {
        agreedToTermsAndCond,
        forwardDataThirdParty,
        subscribeNewsletterEmail,
      },
      {
        onSuccess: () => {
          toaster.success("Settings updated successfully!");
          refetch();
          setIsLoadingUpdate(false);
        },
        onError: (error) => {
          console.error("Failed to update settings:", error);
          toaster.danger("Failed to update settings. Please try again.");
          setIsLoadingUpdate(false);
        },
      },
    );
  };

  if (isLoadingUser) return <Spinner />;

  function handleDeleteAccount(id: string): void {
    deleteUserMutation.mutateAsync(
      { userId: id },
      {
        onSuccess: () => {
          toaster.success("Account deleted successfully!");
          window.location.href = "/"; // Redirect to homepage
        },
        onError: (error) => {
          console.error("Failed to delete account:", error);
          toaster.danger("Failed to delete account. Please try again.");
        },
      },
    );
  }
  return (
    <>
      <Head>
        <title>ONE | Settings</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Base title="Settings">
        <Protected redirectTo="/">
          {!isLoadingUser && user && (
            <div
              className="settings-container"
              style={{
                maxWidth: "800px",
                marginLeft: "0",
                marginRight: "auto",
                padding: "20px",
              }}
            >
              <Pane
                padding={majorScale(3)}
                background="#F1F2F6"
                borderRadius={8}
                elevation={1}
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <ToggleSwitch
                    label="I agree to the Terms and Conditions"
                    checked={agreedToTermsAndCond}
                    onChange={(e) => setAgreedToTermsAndCond(e.target.checked)}
                    disabled={true}
                  />
                  <ToggleSwitch
                    label="Consent to forward data to third parties"
                    checked={forwardDataThirdParty}
                    onChange={(e) => setForwardDataThirdParty(e.target.checked)}
                  />
                  <ToggleSwitch
                    label="Subscribe to newsletter emails"
                    checked={subscribeNewsletterEmail}
                    onChange={(e) =>
                      setSubscribeNewsletterEmail(e.target.checked)
                    }
                  />
                  <Button
                    appearance="primary"
                    intent="success"
                    type="submit"
                    className="mt-5 w-full p-4 md:w-1/3"
                    isLoading={isLoadingUpdate}
                  >
                    Update Settings
                  </Button>
                </form>
                <Button
                  appearance="secondary"
                  intent="danger"
                  className="mt-5 w-full p-4 md:w-1/3"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  style={{ marginTop: "20px", color: "#e64051" }}
                >
                  Delete Account
                </Button>
              </Pane>
            </div>
          )}
        </Protected>
      </Base>
      <Dialog
        isShown={isDeleteDialogOpen}
        title="Delete Account"
        intent="danger"
        onCloseComplete={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => user && handleDeleteAccount(user.id)}
        confirmLabel="Delete Forever"
        cancelLabel="Cancel"
      >
        Deleting your account is irreversible. You will lose all your data. Are
        you sure?
      </Dialog>
    </>
  );
};
