import Head from "next/head";
import { CustomBackground } from "../../Components/Background";
import { Logo } from "../../Components";
import Link from "next/link";

export const Privacy = () => {
  return (
    <>
      <Head>
        <title>ONE | Privacy Policy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="isolate flex flex-col items-center justify-center bg-white">
        <CustomBackground />

        <div className="flex w-[90%] flex-col gap-5 px-3 pt-20 text-gray-600 md:w-1/2">
          <Link href="/">
            <Logo />
          </Link>
          <h1 className="w-full py-10 text-4xl font-bold text-gray-900">
            Privacy Policy
          </h1>
          <div className="flex flex-col gap-2 pb-10">
            <h2 className="text-2xl font-semibold text-gray-900">
              Informasi tentang perlindungan data dalam aplikasi web &quot;Sensus PPI
              Jerman&quot;
            </h2>
            <p>
              Perlindungan data dalam “Sensus PPI Jerman” dilaksanakan
              berdasarkan peraturan Hukum Perlindungan Data (General Data
              Protection Regulation) yang diatur oleh Uni Eropa dalam EU
              Directive 95/46/EC dan EU GDPR 2016/679.
            </p>
          </div>
          <div className="flex flex-col gap-2 pb-10">
            <h2 className="text-2xl font-semibold text-gray-900">
              Informasi Penggunaan Data
            </h2>
            <p>
              “Sensus PPI Jerman” merupakan program kerja yang lahir dari
              keresahan anggota Perhimpunan Pelajar Indonesia di Jerman (PPI
              Jerman) akan sulitnya mencari informasi terkait mahasiswa di
              Jerman. Melakukan pendataan atas informasi terkini mahasiswa
              Indonesia di Jerman sangatlah penting.
            </p>
            <div className="py-3">
              <p>Tujuan didirikan &quot;Sensus PPI Jerman&quot; ialah untuk:</p>
              <ol className="flex list-inside list-decimal flex-col gap-2 py-2 pl-4">
                <li>Pendataan pelajar Indonesia di Jerman yang aktual</li>
                <li>Pembentukan basis data pelajar Indonesia di Jerman</li>
                <li>Pemetaan pelajar Indonesia di Jerman</li>
              </ol>
            </div>
            <div className="py-3">
              <p>
                Untuk mencapai tujuan di atas, PPI Jerman hendak mengumpulkan
                data mahasiswa yang bersifat sukarela. Data yang akan
                dikumpulkan pada “Sensus PPI Jerman” adalah sebagai berikut:{" "}
              </p>
              <ol className="flex list-inside list-decimal flex-col gap-2 pl-4 pt-2">
                <li>Nama Lengkap</li>
                <li>Tanggal Lahir</li>
                <li>Jenis Kelamin</li>
                <li>Status Pendidikan Saat Ini</li>
                <li>Bidang Studi</li>
                <li>Spesialisasi dalam Bidang Studi</li>
                <li>Afiliasi</li>
                <li>Alamat E-mail aktif</li>
                <li>Alamat tempat tinggal di Jerman</li>
                <li>PPI Cabang asal</li>
              </ol>
            </div>
            <p>
              Data pelajar yang terkumpul akan disimpan dalam basis data
              (database) PPI Jerman.
            </p>
          </div>
          <div className="flex flex-col gap-2 pb-10">
            <h2 className="text-2xl font-semibold text-gray-900">
              Ketentuan Pengelolaan Data
            </h2>
            <p>
              Dalam hal pengelolaan data, PPI Jerman bertanggung jawab untuk:
            </p>
            <div className="">
              <ol className="flex list-inside list-decimal flex-col gap-2 py-2 pl-4">
                <li>
                  Mengelola dan mengolah data sesuai dengan persetujuan pemilik
                  data.
                </li>
                <li>
                  Memberitahukan kepada pemilik data secara transparan terkait
                  seluruh proses pengolahan dan penggunaan data.
                </li>
                <li>
                  Menjamin kerahasiaan informasi yang telah dikirimkan oleh
                  pemilik data.
                </li>
              </ol>
            </div>
            <p>
              Dalam hal pengelolaan data, pemilik data memiliki hak-hak sebagai
              berikut:
            </p>
            <div className="">
              <ol className="flex list-inside list-decimal flex-col gap-2 py-2 pl-4">
                <li>Meminta akses atas data yang telah dikirimkan.</li>
                <li>
                  Meminta pembetulan atau revisi atas data yang telah
                  dikirimkan.
                </li>
                <li>Meminta penghapusan atas data yang telah dikirimkan.</li>
                <li>
                  Meminta pembatasan pengolahan data pada sebagian atau seluruh
                  informasi yang dianggap sensitif.
                </li>
              </ol>
            </div>
          </div>
          <div className="flex flex-col gap-2 pb-10">
            <h2 className="text-2xl font-semibold text-gray-900">
              Ketentuan Penyimpanan Data
            </h2>
            <p>
              Data yang telah dikumpulkan di Sensus PPI Jerman akan disimpan
              dalam basis data milik PPI Jerman.
            </p>
            <p>
              PPI Jerman dapat menyimpan data selama PPI Jerman masih
              membutuhkannya.
            </p>
            <p>
              PPI Jerman akan memberitahukan kepada Pemilik Data jika diperlukan
              adanya perubahan terhadap penyimpanan data dan/atau penghapusan
              data.
            </p>
          </div>
          <div className="flex flex-col gap-2 pb-20">
            <h2 className="text-2xl font-semibold text-gray-900">
              Daftar Tindakan oleh Pemilik Data
            </h2>
            <p>
              Dengan ini, saya menyatakan telah membaca seluruh Informasi
              Perlindungan Data Dalam Sensus PPI Jerman.
            </p>
            <p>
              Saya mengetahui dan menyetujui bahwa data yang saya kirimkan akan
              dikelola dan diolah oleh PPI Jerman untuk kegiatan Sensus PPI
              Jerman sesuai dengan ketentuan penggunaan yang telah disebutkan
              pada bagian “Informasi Penggunaan Data”.
            </p>
            <div className="flex flex-col gap-2 pt-2 ">
              <p>Catatan:</p>
              <p>Prinsip Perlindungan Data dalam Kerangka GDPR:</p>
              <p className="font-semibold">Bahasa Inggris</p>
              <ol className="flex list-inside list-decimal flex-col gap-2 py-2 pl-4">
                <li>
                  Freely given - the person must not be pressured into giving
                  consent or suffer any detriment if they refuse.
                </li>
                <li>
                  Specific - the person must be asked to consent to individual
                  types of data processing.
                </li>
                <li>
                  Informed - the person must be told what they&apos;re consenting to.
                </li>
                <li>Unambiguous - language must be clear and simple.</li>
                <li>
                  Clear affirmative action - the person must expressly consent
                  by doing or saying something.
                </li>
              </ol>
              <p className="font-semibold">Bahasa Indonesia</p>
              <ol className="flex list-inside list-decimal flex-col gap-2 py-2 pl-4">
                <li>
                  Diberikan secara sukarela - bahwasannya tidak ada paksaan
                  terhadap Pengguna dalam persetujuan ini
                </li>
                <li>
                  Spesifik/khusus - Pengguna wajib memberikan persetujuan atas
                  pengolahan data secara individual
                </li>
                <li>
                  Tahu-setuju - Pengguna wajib mengetahui apa yang mereka
                  setujui
                </li>
                <li>
                  Tidak ambigu - Tata bahasa harus jelas dan dapat dimengerti
                </li>
                <li>
                  Persetujuan - Pengguna harus menyatakan persetujuannya dengan
                  melakukan atau mengatakan sesuatu
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
