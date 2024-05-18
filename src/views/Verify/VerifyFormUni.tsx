import { useState, useEffect } from "react";
import { Button, TextInputField, Combobox } from "evergreen-ui";
import type { University } from "../../types";
import { Universities } from "../../Components/optionsList/de-university-list";
import { trpc } from "../../utils/trpc";
import { FormError } from "../../Components/ui/FormError";
import { FormSuccess } from "../../Components/ui/FormSuccess";
import { useSession } from "next-auth/react";

const universityList: University[] = Universities as University[];

export const VerifyFormUni: React.FC = () => {
  const { data: session } = useSession();
  const { data: user } = trpc.user.getUser.useQuery();

  const [universityEmail, setUniversityEmail] = useState(
    session?.user?.universityEmail || "",
  );
  const [university, setUniversity] = useState<University | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // function that updates the name only
  useEffect(() => {
    if (session?.user?.universityName) {
      const initialUniversity = universityList.find(
        (u) => u.name === session?.user?.universityName,
      );
      setUniversity(initialUniversity || null);
    }
  }, [session?.user?.universityName]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    return result;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // reset
    setError("");
    setSuccess("");

    if (session?.user?.verification === "VERIFIED") {
      return setError("User is already verified.");
    }

    if (!university) {
      return setError("Please select a university.");
    }

    if (
      universityEmail &&
      university &&
      !university.domains.some((domain) => universityEmail.endsWith(domain))
    ) {
      return setError("Email must be from the selected university.");
    }

    await updateUserUniEmailAndUni.mutateAsync({
      universityEmail,
      universityName: university.name,
    });

    const sendResult = await handleSendVerificationEmail();
    if (sendResult) {
      setError("");
      setSuccess(
        "Verification email sent successfully. Please check your email.",
      );
    } else {
      setSuccess("");
      setError(
        "ERROR: Something Went Wrong! \nFailed to send verification email.",
      );
    }

    setIsButtonDisabled(true); // Disable the button
    setTimeout(() => {
      setIsButtonDisabled(false); // Enable the button after 60 seconds
    }, 60000);
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
  setUniversity: React.Dispatch<React.SetStateAction<University | null>>;
  universityEmail: string;
  setUniversityEmail: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  error: string;
  success: string;
  isButtonDisabled: boolean;
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
  isButtonDisabled,
}) => (
  <>
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Pilih universitas anda saat ini
        </label>
        <Combobox
          placeholder="Universitas"
          items={universityList}
          itemToString={(universityList) =>
            universityList ? universityList.name : ""
          }
          disabled={isLoading}
          width="100%"
          onChange={(selected: University) => {
            setUniversity(selected);
            console.log(selected);
          }}
        />
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
        </div>
        <Button
          isLoading={isLoading}
          appearance="primary"
          disabled={isButtonDisabled}
        >
          Verifikasi Email Universitas
        </Button>
        {isButtonDisabled && (
          <p className="text-sm text-gray-500">
            Tidak dapat email verifikasi? Kirim ulang setelah 60.
          </p>
        )}
      </div>
    </form>
  </>
);
