import { useState, useEffect, ChangeEvent } from "react";
import { Button, TextInputField, TextInput, Autocomplete } from "evergreen-ui";
import type { University } from "../../types";
import { Universities } from "../../Components/optionsList/de-university-list";
import { trpc } from "../../utils/trpc";
import { FormError } from "../../Components/ui/FormError";
import { FormSuccess } from "../../Components/ui/FormSuccess";
import { useSession } from "next-auth/react";
import { FormWarning } from "../../Components/ui/FormWarning";

const universityList: University[] = Universities as University[];

export const VerifyFormUni: React.FC = () => {
  const { data: session } = useSession();
  const { data: user } = trpc.user.getUser.useQuery();

  const [universityEmail, setUniversityEmail] = useState(
    session?.user?.universityEmail || "",
  );
  const [universityName, setUniversity] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [lastSentAt, setLastSentAt] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  // function that updates the name only
  useEffect(() => {
    if (session?.user?.universityName) {
      const initialUniversity = universityList.find(
        (u) => u.name === session?.user?.universityName,
      );
      setUniversity(initialUniversity?.name || null);
    }
  }, [session?.user?.universityName]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [warning, setWarning] = useState("");
  const queryClient = trpc.useUtils();
  const generateAndSendTokenMutation =
    trpc.token.generateAndSendVerificationToken.useMutation();
  const updateUserUniEmailAndUni =
    trpc.user.updateUserUniEmailAndUni.useMutation({
      onSuccess: () => queryClient.user.getUser.invalidate(),
    });

  const handleSendVerificationEmail = async () => {
    if (!user || !universityEmail) return;
    const result = await generateAndSendTokenMutation.mutateAsync({
      id: user.id,
      email: universityEmail,
    });

    if (result && result.lastSentAt) {
      setLastSentAt(new Date(result.lastSentAt));
    }
    return result;
  };

  useEffect(() => {
    if (lastSentAt) {
      const updateRemainingTime = () => {
        const now = new Date();
        const timeLeft =
          60 - Math.floor((now.getTime() - lastSentAt.getTime()) / 1000);
        if (timeLeft > 0) {
          setRemainingTime(timeLeft);
          setIsButtonDisabled(true);
        } else {
          setRemainingTime(null);
          setIsButtonDisabled(false);
        }
      };

      updateRemainingTime(); // Initial call to set the state immediately
      const intervalId = setInterval(updateRemainingTime, 1000); // Update every second

      return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    } else {
      setIsButtonDisabled(false);
      setRemainingTime(null);
    }
  }, [lastSentAt]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // reset
    setError("");
    setSuccess("");
    setWarning("");

    if (session?.user?.verification === "VERIFIED") {
      return setError("User is already verified.");
    }

    if (!universityName) {
      return setError("Please select a university.");
    }

    const university = universityList.find((u) => u.name === universityName);
    if (
      universityEmail &&
      university &&
      !university.domains.some((domain) => universityEmail.endsWith(domain))
    ) {
      return setError("Email must be from the selected university.");
    }
    if (!university && universityName && universityName.trim() !== "") {
      return setWarning(
        "University not found. Are you sure this is your university?",
      );
    }

    await updateUserUniEmailAndUni.mutateAsync({
      universityEmail,
      universityName: universityName,
    });

    const sendResult = await handleSendVerificationEmail();
    if (sendResult && sendResult.success) {
      setError("");
      setSuccess(
        "Verification email sent successfully. Please check your email and potentially spam folder.",
      );
    } else if (sendResult && !sendResult.success) {
      setSuccess("");
      setError(
        sendResult.message ||
          "ERROR: Something Went Wrong! Failed to send verification email.",
      );
    } else {
      setSuccess("");
      setError(
        "ERROR: Something Went Wrong! Failed to send verification email.",
      );
    }
  };

  if (session?.user?.verification === "UNVERIFIED") {
    return (
      <>
        <h1 className="pb-3 text-center text-2xl font-semibold">
          Verifikasi Status Student
        </h1>
        <p className="mb-5">
          Masukkan email universitas anda untuk memverifikasi status student
          anda. Anda akan dikirimkan email verifikasi ke alamat email
          universitas anda, yang mana anda harus memverifikasi dalam jangka
          waktu <span className="font-bold">10 menit</span>.
        </p>
        <VerifyForm
          universityName={universityName ?? ""}
          universityList={universityList}
          setUniversity={setUniversity}
          universityEmail={universityEmail}
          setUniversityEmail={setUniversityEmail}
          handleSubmit={handleSubmit}
          isLoading={
            updateUserUniEmailAndUni.isLoading ||
            generateAndSendTokenMutation.isLoading
          }
          error={error}
          success={success}
          isButtonDisabled={isButtonDisabled}
          remainingTime={remainingTime}
          warning={warning}
        />
      </>
    );
  } else {
    return (
      <div className="flex flex-col justify-center gap-10">
        <h1 className="pb-3 text-center text-2xl font-semibold">
          Verifikasi Status Student
        </h1>
        <FormSuccess message="Terima kasih sudah memverifikasi status student anda!" />
      </div>
    );
  }
};

interface VerifyFormProps {
  universityList: University[];
  setUniversity: React.Dispatch<React.SetStateAction<string | null>>;
  universityEmail: string;
  setUniversityEmail: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  error: string;
  success: string;
  isButtonDisabled: boolean;
  remainingTime: number | null;
  universityName: string;
  warning: string;
}

const VerifyForm: React.FC<VerifyFormProps> = ({
  universityList,
  setUniversity,
  universityEmail,
  setUniversityEmail,
  handleSubmit,
  isLoading,
  error,
  success,
  warning,
  isButtonDisabled,
  remainingTime,
  universityName,
}) => (
  <>
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Pilih universitas anda saat ini
        </label>
        <Autocomplete
          items={universityList.map((u) => u.name)}
          onChange={(university) => {
            setUniversity(university);
          }}
          isFilterDisabled={isLoading}
        >
          {(props) => {
            const { getInputProps, getRef, openMenu } = props;
            return (
              <TextInput
                placeholder="Leibniz Universität Hannover"
                ref={getRef}
                {...getInputProps({
                  onFocus: () => {
                    openMenu();
                  },
                  onChange: (e: ChangeEvent<HTMLInputElement>) =>
                    setUniversity(e.target.value ?? ""),
                  value: universityName,
                })}
                disabled={isLoading}
                width="100%"
              />
            );
          }}
        </Autocomplete>
        <TextInputField
          marginTop={8}
          marginBottom={24}
          label="University Email"
          type="email"
          placeholder="nicole@tu-jerman.de"
          value={universityEmail}
          disabled={isLoading}
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUniversityEmail(e.target.value)
          }
        />
        <div className="w-full py-5">
          <FormError message={error} />
          <FormSuccess message={success} />
          <FormWarning message={warning} />
        </div>
        <Button
          isLoading={isLoading}
          appearance="primary"
          disabled={isButtonDisabled}
        >
          {isButtonDisabled
            ? `Wait ${remainingTime}s`
            : "Verifikasi Email Universitas"}
        </Button>
        {isButtonDisabled && (
          <p className="text-sm text-gray-500">
            Tidak dapat email verifikasi? Kirim ulang setelah {remainingTime}{" "}
            detik.
          </p>
        )}
      </div>
    </form>
  </>
);
