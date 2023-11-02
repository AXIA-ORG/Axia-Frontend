import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { useAccount } from "wagmi";
import '../config/i18n'
import { Img } from '@chakra-ui/react' 
import VerifierModal from "../components/modal/Verifier.modal";
import styles from "../styles/Home.module.css";
import Hero from '../components/home/Hero'
import Nav from "../components/general/Navbar";
import Features from "../components/home/Features";
import AxiaHome from "../public/images/AxiaHome.png"
import React, { useState } from 'react'; 

const Home: NextPage = () => {
  const { address, isConnected } = useAccount()
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false); // Define el estado isModalOpen

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Nav />
      <div className={styles.container}>
        <Head>
          <title>Axia</title>
          <meta
            content="Web3 representation and meritocracy"
            name="description"
          />
          <link href="/favicon.ico" rel="icon" />
        </Head>

        <main className={styles.main}>
          <Hero />
          <Img src={AxiaHome.src}
           maxW={{ base: "100%", md: "100vw" }}
          objectFit='cover'
           alt="Your Image" />
          <Features />
            {/* Agrega un botón o enlace para abrir el modal */}
           <button onClick={openModal}>Open Modal</button>
  
            {/* Renderiza el modal condicionalmente */}
            {isModalOpen && (
              <VerifierModal isOpen={isModalOpen} onClose={closeModal} />
            )}


        </main>
        

        <footer className={styles.footer}>
          <a
            href="https://rainbow.me"
            rel="noopener noreferrer"
            target="_blank"
          >
            Made with ❤️ by Carla, Sandra & Sebas
          </a>
        </footer>
      </div>
    </>
  );
};

export default Home;
