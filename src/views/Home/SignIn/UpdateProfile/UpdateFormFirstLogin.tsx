import {
  Button,
  Checkbox,
  SelectField,
  TextInputField,
  FormField,
  TagInput,
} from "evergreen-ui";
import React, { useState, useEffect } from "react";
import { ListPPICabang } from "../../../../Components/optionsList/ListPPICabang";
import type { RouterOutputs } from "../../../../utils/trpc";
import { trpc } from "../../../../utils/trpc";
import {
  germanCities,
  studiengangsListe,
} from "../../../../Components/optionsList";
import { Autocomplete } from "evergreen-ui";
import { FormError } from "../../../../Components/ui";
import Link from "next/link";

type UpdateProfileFormFirstLoginProps = {
  user: RouterOutputs["user"]["getUser"];
};

export const UpdateProfileFormFirstLogin: React.FC<
  UpdateProfileFormFirstLoginProps
> = ({ user }) => {
  const [name, setName] = useState(user?.name ?? "");
  const [birthDate, setBirthDate] = useState<string | undefined>(
    user.birthDate?.toISOString().slice(0, 10) ?? "",
  );
  const [expectedGraduation, setExpectedGraduation] = useState("");
  const [ppicabang, setPpiCabang] = useState("");
  const [affiliation, setAffiliation] = useState<string[]>();
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [occupation, setOccupation] = useState("");
  const [location, setLocation] = useState("");
  const [bundesland, setBundesland] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [formError, setFormError] = useState("");
  const [studySpecialization, setStudySpecialization] = useState("");

  const [checkedPrivacy, setCheckedPrivacy] = useState(false);
  const [checkedDataForwards, setCheckedDataForwards] = useState(false);

  // useContext is deprecated, use useUtils instead
  const queryClient = trpc.useUtils();

  const { mutateAsync: updateUserLogin, isLoading } =
    trpc.user.updateUserLogin.useMutation({
      onSuccess: async () => {
        await queryClient.user.getUser.invalidate();
        console.log("user first registered successfully!");
        window.location.reload();
      },
    });

  // handle fieldOfStudy

  type Studiengang = {
    name: string;
  };

  const handleFieldOfStudy = (selectedFieldOfStudy: Studiengang) => {
    if (selectedFieldOfStudy) {
      setFieldOfStudy(selectedFieldOfStudy.name);
      console.log(selectedFieldOfStudy);
    }
  };

  // handle cities
  type City = {
    name: string;
    bundesland: string;
  };
  const handleCity = (selectedCity: City) => {
    if (selectedCity) {
      setLocation(selectedCity.name);
      console.log(selectedCity);
    }
  };

  // Corrected to trigger handleBundesland automatically when city changes
  useEffect(() => {
    const selectedCity = germanCities.find((city) => city.name === location);
    if (selectedCity) {
      setBundesland(selectedCity.bundesland);
    } else {
      console.log("City not found");
    }
  }, [location]); // Depend on location and germanCities to re-run

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // check privacy
    if (!checkedPrivacy) {
      setFormError("Please agree to the terms and conditions.");
      return;
    }

    setFormError("");

    await updateUserLogin({
      id: user!.id,
      name,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      occupation,
      location,
      address,
      zipCode,
      gender,
      ppicabang,
      bundesland,
      affiliation,
      fieldOfStudy,
      studySpecialization,
      expectedGraduation: [
        "bachelor",
        "master",
        "doctor",
        "ausbildung",
      ].includes(occupation)
        ? new Date(expectedGraduation)
        : undefined,
      agreedToTermsAndCond: checkedPrivacy,
      forwardDataThirdParty: checkedDataForwards,
    });
  };

  const isProfileUpdated = !user!.updated;

  // TODO: Make component reusable

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <div className="">
        <TextInputField
          label="Nama"
          value={name}
          disabled={isLoading}
          required={isProfileUpdated}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
        />
        <TextInputField
          label="Tanggal Lahir"
          description="(opsional)"
          type="date"
          disabled={isLoading}
          value={birthDate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setBirthDate(e.target.value)
          }
        />
        <SelectField
          label="Jenis Kelamin"
          value={gender}
          disabled={isLoading}
          required={isProfileUpdated}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Pilih Jenis Kelamin</option>
          <option value="Laki-Laki">Laki-Laki</option>
          <option value="Perempuan">Perempuan</option>
        </SelectField>
      </div>
      <div className="">
        <SelectField
          label="Status Pendidikan Saat Ini"
          description="Pilih status pendidikan saat ini."
          value={occupation}
          disabled={isLoading}
          required={isProfileUpdated}
          onChange={(e) => setOccupation(e.target.value)}
        >
          <option value="">Pilih Status Pendidikan</option>
          <option value="ausbildung">Ausbildung</option>
          <option value="bachelor">Bachelor</option>
          <option value="master">Master</option>
          <option value="doctor">Doctoral</option>
        </SelectField>

        <Autocomplete
          items={studiengangsListe}
          itemToString={(studiengangsListe) =>
            studiengangsListe ? studiengangsListe.name : ""
          }
          onChange={handleFieldOfStudy}
        >
          {(props) => {
            const { getInputProps, getRef } = props;
            return (
              <TextInputField
                {...getInputProps()}
                label="Bidang Studi"
                description="Bidang Studi dalam bahasa Jerman. Jika tidak ada di daftar bidang studi, silahkan pilih 'Others' dan informasikan kepada admin untuk menambah list jurusan."
                ref={getRef}
                disabled={isLoading}
                required={isProfileUpdated}
              />
            );
          }}
        </Autocomplete>

        <TextInputField
          label="Spesialisasi dalam Bidang Studi"
          description="Contoh: AI and Machine Learning (Informatik), Denkmalpflege (Architektur), Neurologie (Medizin), dan lainnya."
          hint="Maksimum 50 karakter."
          isInvalid={studySpecialization.length > 50}
          disabled={isLoading}
          value={studySpecialization}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setStudySpecialization(e.target.value)
          }
        />

        <TextInputField
          label="Perkiraan Tanggal Kelulusan"
          type="date"
          disabled={isLoading}
          value={expectedGraduation}
          required={
            isProfileUpdated &&
            ["bachelor", "master", "doctoral", "ausbildung"].includes(
              occupation,
            )
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setExpectedGraduation(e.target.value)
          }
        />

        <FormField
          width="100%"
          marginBottom={20}
          label="Afiliasi"
          description="Institusi Pendidikan (Kampus), Organisasi, Afiliasi, dan lainnya. (Dalam bentuk tags)"
        >
          <TagInput
            width="100%"
            id="affiliation"
            values={affiliation}
            onChange={(values: string[]) => {
              setAffiliation(values);
            }}
          />
        </FormField>
      </div>

      <div className="">
        <div className="flex w-full flex-col gap-5 md:flex-row">
          <TextInputField
            label="Alamat (Jalan, Nomor Rumah)"
            description="Alamat tempat tinggal di Jerman"
            placeholder="Braunschweigerstraße 53"
            required={isProfileUpdated}
            disabled={isLoading}
            value={address}
            width="100%"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAddress(e.target.value)
            }
          />

          <TextInputField
            label="Kode Pos"
            description="Kode Pos tempat tinggal di Jerman"
            placeholder="38106"
            required={isProfileUpdated}
            disabled={isLoading}
            value={zipCode}
            width="100%"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setZipCode(e.target.value)
            }
          />
        </div>

        <Autocomplete
          items={germanCities}
          itemToString={(germanCities) =>
            germanCities ? germanCities.name : ""
          }
          onChange={handleCity}
        >
          {(props) => {
            const { getInputProps, getRef } = props;
            return (
              <TextInputField
                label="Kota"
                required={isProfileUpdated}
                placeholder="Domisili"
                ref={getRef}
                disabled={isLoading}
                description="Lokasi domisili kota anda di Jerman"
                {...getInputProps()}
              />
            );
          }}
        </Autocomplete>

        <SelectField
          required={isProfileUpdated}
          disabled={true}
          value={bundesland}
          label="Negara Bagian"
          description="Negara bagian menyesuaikan kota/domisili anda."
        >
          <option value="">Negara Bagian</option>
          <option value="Baden-Württemberg">Baden-Württemberg</option>
          <option value="Bayern">Bayern</option>
          <option value="Berlin">Berlin</option>
          <option value="Brandenburg">Brandenburg</option>
          <option value="Bremen">Bremen</option>
          <option value="Hamburg">Hamburg</option>
          <option value="Hessen">Hessen</option>
          <option value="Mecklenburg-Vorpommern">Mecklenburg-Vorpommern</option>
          <option value="Niedersachsen">Niedersachsen</option>
          <option value="Nordrhein-Westfalen">Nordrhein-Westfalen</option>
          <option value="Rheinland-Pfalz">Rheinland-Pfalz</option>
          <option value="Saarland">Saarland</option>
          <option value="Sachsen">Sachsen</option>
          <option value="Sachsen-Anhalt">Sachsen-Anhalt</option>
          <option value="Schleswig-Holstein">Schleswig-Holstein</option>
          <option value="Thüringen">Thüringen</option>
        </SelectField>

        <SelectField
          label="PPI Cabang"
          required={isProfileUpdated}
          value={ppicabang}
          disabled={isLoading}
          description="PPI Cabang terdekat dari domisili anda di Jerman"
          onChange={(e) => setPpiCabang(e.target.value)}
        >
          {ListPPICabang.map((ppi) => {
            return (
              <option key={ppi.value} value={ppi.value}>
                {ppi.label}
              </option>
            );
          })}
        </SelectField>
      </div>

      <div className="flex flex-col pb-2">
        <div className="">
          <Checkbox
            label={
              <h1 className="font-bold">
                Setuju dengan syarat dan ketentuan yang berlaku *
              </h1>
            }
            checked={checkedPrivacy}
            disabled={isLoading}
            required={true}
            marginBottom={8}
            onChange={(e) => setCheckedPrivacy(e.target.checked)}
          />
          <p className="text-xs leading-relaxed text-gray-500">
            Dengan ini, anda setuju dengan syarat dan ketentuan yang berlaku di
            Sensus PPI Jerman. Dimohon untuk membaca syarat dan ketentuan yang
            berlaku dengan seksama sebelum melanjutkan. Syarat dan ketentuan
            dapat dilihat{" "}
            <Link
              href="/terms-and-conditions"
              className="text-blue-500 transition hover:text-blue-300"
            >
              disini
            </Link>
            .
          </p>
        </div>

        <div className="">
          <Checkbox
            label={
              <h1 className="font-bold">
                Setuju untuk meneruskan data ke pihak ketiga
              </h1>
            }
            checked={checkedDataForwards}
            disabled={isLoading}
            required={false}
            marginBottom={8}
            onChange={(e) => setCheckedDataForwards(e.target.checked)}
          />
          <p className="text-xs leading-relaxed text-gray-500">
            Dengan ini, anda setuju jika data yang anda masukkan akan diteruskan
            ke PPI Jerman Cabang terdekat dari domisili anda di Jerman. Selain
            itu, data yang anda masukkan akan digunakan untuk keperluan internal
            PPI Jerman dan tidak akan disebarkan ke pihak ketiga tanpa
            persetujuan anda
          </p>
        </div>
      </div>
      <FormError message={formError} />

      <Button
        type="submit"
        appearance="primary"
        isLoading={isLoading}
        className="mt-10 w-full"
      >
        Save
      </Button>
    </form>
  );
};
