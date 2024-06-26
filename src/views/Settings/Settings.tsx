import React, { useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { Base, Card, Protected } from "../../Components";
import { trpc } from "../../utils/trpc";
import { Button, Spinner, Pane, toaster, Switch, Dialog } from "evergreen-ui";

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
  const { data: user, isLoading: isLoadingUser } = trpc.user.getUser.useQuery();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  const [agreedToTermsAndCond, setAgreedToTermsAndCond] = useState<boolean>(
    user?.agreedToTermsAndCond ?? true,
  );
  const [forwardDataThirdParty, setForwardDataThirdParty] = useState<boolean>(
    user?.forwardDataThirdParty ?? false,
  );
  const [subscribeNewsletterEmail, setSubscribeNewsletterEmail] =
    useState<boolean>(user?.subscribeNewsletterEmail ?? false);

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

  const handleDeleteAccount = async (userId: string) => {
    setIsDeleteDialogOpen(false); // Close the confirmation dialog
    await deleteUserMutation.mutateAsync(
      { userId },
      {
        onSuccess: () => {
          localStorage.removeItem("token");
          toaster.notify("Account deleted successfully.");
          // Redirect to login page
          window.location.href = "/";
        },
        onError: (error) => {
          console.error("Failed to delete account:", error);
          toaster.danger("Failed to delete account. Please try again.");
        },
      },
    );
  };

  if (isLoadingUser)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <Head>
        <title>ONE | Settings</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Base title="Settings">
        <Protected redirectTo="/">
          <div className="py-4">
            {!isLoadingUser && user && (
              <Card className="max-w-[600px]">
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
                  <div className="pt-1">
                    <Button
                      appearance="primary"
                      intent="success"
                      type="submit"
                      className="mt-5 w-full p-4 md:w-1/3"
                      isLoading={isLoadingUpdate}
                    >
                      Update Settings
                    </Button>
                  </div>
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
              </Card>
            )}
          </div>
        </Protected>
      </Base>
      <Dialog
        isShown={isDeleteDialogOpen}
        title="Delete Account"
        intent="danger"
        onCloseComplete={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => user && handleDeleteAccount(user.id)} // checking is user is defined before calling
        confirmLabel="Delete Forever"
        cancelLabel="Cancel"
        //position={Position.BOTTOM}
      >
        Deleting your account is irreversible. You will lose all your data. Are
        you sure?
      </Dialog>
    </>
  );
};
