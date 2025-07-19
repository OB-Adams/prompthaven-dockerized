"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

// Module-scoped cache
let isFetched = false;
let cachedProviders = null;

const Nav = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null); // Lowercase 'providers' for consistency
  const [toggleDropdown, setToggleDropdown] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      if (isFetched) {
        if (providers !== cachedProviders) {
          setProviders(cachedProviders); // Only update if different
        }
        return;
      }
      try { 
        const res = await getProviders();
        cachedProviders = res;
        isFetched = true;
        setProviders(res);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };
    fetchProviders();
  }, []);

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/assets/images/logo.svg"
          alt="Prompt Haven Logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">Prompt Haven</p>
      </Link>

      {/* Desktop Navigation */}
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-prompt" className="black_btn">
              Create Post
            </Link>
            <button
              type="button"
              className="outline_btn"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
            <Link href="/profile">
              <Image
                src={session.user.image || "/assets/images/logo.svg"}
                alt="Profile"
                width={37}
                height={37}
                className="rounded-full"
              />
            </Link>
          </div>
        ) : (
          <>
            {providers ? (
              Object.values(providers).map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  className="black_btn"
                  onClick={() => signIn(provider.id)}
                >
                  Sign in with {provider.name}
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Loading sign-in options...
              </p>
            )}
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            <Image
              src={session.user.image || "/assets/images/logo.svg"}
              alt="Profile"
              width={37}
              height={37}
              className="rounded-full cursor-pointer"
              onClick={() => setToggleDropdown((prev) => !prev)}
            />
            {toggleDropdown && (
              <div className="dropdown absolute top-12 right-0 bg-white shadow-lg rounded-md py-2 px-4 z-10">
                <Link
                  href="/profile"
                  className="dropdown_link block py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setToggleDropdown(false)}
                >
                  {session.user.username || "My Profile"}
                </Link>
                <Link
                  href="/create-prompt"
                  className="dropdown_link block py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setToggleDropdown(false)}
                >
                  Create Prompt
                </Link>
                <button
                  type="button"
                  className="mt-2 w-full black_btn text-sm"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers ? (
              Object.values(providers).map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  className="black_btn"
                  onClick={() => signIn(provider.id)}
                >
                  Sign in with {provider.name}
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Loading sign-in options...
              </p>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
