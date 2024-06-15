import React from "react";
import { UpdateProfileFormFirstLogin } from "./UpdateFormFirstLogin";
import { ProtectedUpdate } from "./ProtectedUpdate";
import { trpc } from "../../../../utils/trpc";
import { Card } from "../../../../Components/Card";
import type { NextPage } from "next";
import { Logo } from "../../../../Components";
import Link from "next/link";
import Head from "next/head";

export const UpdateProfilePage: NextPage = () => {
  const { data: user, isLoading } = trpc.user.getUser.useQuery();
  return (
    <>
      <Head>
        <title>ONE | Registration</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProtectedUpdate redirectTo="/">
        {!isLoading && user && (
          <div className="isolate bg-slate-100">
            <div className="flex min-h-screen flex-col items-center justify-center gap-y-10 p-5">
              <Card className="w-full border-none bg-white shadow-xl md:w-1/2">
                <Link href="/">
                  <Logo />
                </Link>
                <h1 className="p-5 text-center text-4xl font-bold">
                  Data Diri Sensus
                </h1>
                <div className="flex flex-col gap-4 py-3 pb-10">
                  <p className="text-sm text-gray-500">
                    Selamat datang di Sensus PPI Jerman!{" "}
                  </p>
                  <p className="text-sm leading-relaxed text-gray-500">
                    Terima kasih telah mendaftarkan diri Anda dan menjadi bagian
                    dari inisiatif penting ini. Dengan partisipasi Anda, Anda
                    tidak hanya berkontribusi pada pengumpulan data yang
                    berharga tetapi juga mendukung pembangunan komunitas pelajar
                    Indonesia di Jerman yang lebih kuat, terinformasi, dan
                    saling terhubung. Melalui aplikasi Sensus PPI Jerman, kami
                    berharap dapat mencapai berbagai tujuan mulia, mulai dari
                    pemetaan demografis yang lebih akurat, pengembangan program
                    pendidikan dan profesional yang sesuai dengan kebutuhan
                    anggota, hingga peningkatan kesejahteraan dan dukungan bagi
                    seluruh komunitas pelajar Indonesia di Jerman. Partisipasi
                    Anda memungkinkan kami untuk membuat keputusan yang
                    didasarkan pada data, memperkuat advokasi, dan merancang
                    inisiatif yang mendukung aspirasi dan keberhasilan Anda.
                  </p>
                  <p className="text-sm leading-relaxed text-gray-500">
                    Kami memohon dengan sangat untuk mengisi data Anda dengan
                    seksama dan sebenar-benarnya. Keakuratan dan kelengkapan
                    informasi yang Anda berikan sangat krusial bagi efektivitas
                    analisis data kami. Setiap detail yang Anda masukkan
                    memainkan peran penting dalam membantu kami mengidentifikasi
                    kebutuhan komunitas, merancang program yang relevan, dan
                    mengadvokasi kepentingan pelajar Indonesia di Jerman.
                  </p>
                  <p className="text-sm leading-relaxed text-gray-500">
                    Kami berkomitmen penuh terhadap perlindungan dan privasi
                    data Anda. Sesuai dengan General Data Protection Regulation
                    (GDPR), kami menjamin bahwa semua informasi yang Anda
                    berikan akan dijaga kerahasiaannya, dikelola dengan ketat,
                    dan tidak akan disalahgunakan atau dibagikan tanpa
                    persetujuan eksplisit Anda. Kami mengimplementasikan standar
                    keamanan yang tinggi untuk memastikan bahwa data Anda aman
                    dan terlindungi dari akses tidak sah atau penggunaan yang
                    tidak tepat.
                  </p>
                </div>
                <UpdateProfileFormFirstLogin user={user} />
              </Card>
            </div>
          </div>
        )}
      </ProtectedUpdate>
    </>
  );
};
