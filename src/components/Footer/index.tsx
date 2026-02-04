
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { MapPin } from 'lucide-react';
const Footer = () => {
  const companyLinks = [
    'Home',
    'About Us',
    'FAQ',
    'Terms of Service',
    'Privacy Policy',
  ];
  const serviceLinks = ['Passenger', 'Driver', 'Agency'];
  const mobileAppLinks = [
    {
      title: 'App Store',
      subtitle: 'DOWNLOAD ON THE',
      path: '/images/apple_icon.png',
      alt: 'apple icon',
    },
    {
      title: 'Play Store',
      subtitle: 'GET IT ON',
      path: '/images/play_store.png',
      alt: 'play store icon',
    },
  ];
  return (
    <footer className="py-16 bg-primaryPurple-500 mt-48">
      <div className="container flex flex-col gap-8">
        <Link href="/">
                  <Image alt="logo" width={110} height={52} src="/logoWhite.png" />

        </Link>
        <div className="flex justify-between w-full items-start gap-4">
          <section className="flex flex-col gap-4">
            <p className="paragraph-large-medium text-white">Company</p>
            <ul className="flex flex-col gap-2">
              {companyLinks.map((link, index) => (
                <li className="paragraph-medium-normal text-white" key={index}>
                  <Link href="#">{link}</Link>{' '}
                </li>
              ))}
            </ul>
          </section>
          <section className="flex flex-col gap-4">
            <p className="paragraph-large-medium text-white">Services</p>
            <ul className="flex flex-col gap-2">
              {serviceLinks.map((link, index) => (
                <li className="paragraph-medium-normal text-white" key={index}>
                  <Link href="#">{link}</Link>{' '}
                </li>
              ))}
            </ul>
          </section>
          <section className="flex flex-col gap-4">
            <p className="paragraph-large-medium text-white">Mobile App</p>
            <ul className="flex flex-col gap-4">
              {mobileAppLinks.map((link, index) => (
                <li
                  className="w-fit flex gap-3 items-center rounded-[10px] border border-white px-[16px] py-[10px]"
                  key={index}
                >
                  <div>
                    <Image
                      src={link.path}
                      alt={link.alt}
                      width={46}
                      height={46}
                    />
                  </div>
                  <div className="flex flex-col gap-[2px]">
                    <p className="paragraph-small-normal text-white">
                      {link.subtitle}
                    </p>
                    <p className="h5-normal text-white">{link.title}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section className="flex gap-2 items-center">
            <Globe color="#fff" size={28} />
            <p className="paragraph-large-medium text-white">English</p>
          </section>
          <section className="flex gap-2 items-center">
            <MapPin color="#fff" size={28} />
            <p className="paragraph-large-medium text-white">
              Yaoundé, Cameroon
            </p>
          </section>
        </div>
        <div className="flex w-full justify-between items-center border-t border-t-white mt-16 py-4">
          <p className="text-white paragraph-small-normal">
            © 2024 Lets Go. All rights reserved
          </p>
          <div className="flex items-center gap-3">
            <Image
              src="/images/twitter.png"
              alt="twitter icon"
              width={30}
              height={30}
            />
            <Image
              src="/images/linkedin.png"
              alt="linkedin icon"
              width={30}
              height={30}
            />
            <Image
              src="/images/facebook.png"
              alt="facebook icon"
              width={30}
              height={30}
            />
            <Image
              src="/images/instagram.png"
              alt="instagram icon"
              width={30}
              height={30}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
