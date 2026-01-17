import { useState } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Menu, X, PawPrint, LogIn, UserPlus, Heart } from "lucide-react";
import Button from "./Button";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const authLinks = [
        { id: "login", name: "Sign In", icon: <LogIn className="h-4 w-4" /> },
        {
            id: "register",
            name: "Sign Up",
            icon: <UserPlus className="h-4 w-4" />
        }
    ];

    return (
        <header className="fixed top-0 left-0 w-full bg-white h-16 z-50 shadow-md">
            <div className="container mx-auto px-4 flex items-center justify-between h-full">
                {/* Logo - Using your original style */}
                <Link
                    to="/"
                    className="text-2xl text-primary items-center flex gap-2 inline-flex font-heading"
                >
                    <PawPrint className="h-6 w-6 text-primary" />
                    <span>PurrfectMatch</span>
                </Link>

                {/* Desktop Navigation - Improved */}
                <nav className="hidden md:flex items-center gap-4">
                    {/* Main Navigation Links */}
                    <HashLink
                        to="/#about"
                        smooth
                        className="text-gray-700 hover:text-primary px-3 py-1"
                    >
                        About
                    </HashLink>
                    <HashLink
                        to="/#contact"
                        smooth
                        className="text-gray-700 hover:text-primary px-3 py-1"
                    >
                        Contact
                    </HashLink>

                    {/* Auth Links - Improved spacing */}
                    <div className="flex items-center gap-2 ml-4">
                        {authLinks.map(link => (
                            <Button
                                key={link.id}
                                to={`/${link.id}`}
                                variant="ghost"
                                size="sm"
                                leftIcon={link.icon}
                                className="px-2"
                            >
                                {link.name}
                            </Button>
                        ))}
                    </div>

                    {/* CTA Button - Improved from original */}
                    <Button
                        to="/find-pet"
                        variant="primary"
                        size="md"
                        leftIcon={<Heart className="h-4 w-4" />}
                        className="rounded-full"
                    >
                        Find a Pet
                    </Button>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2"
                >
                    {isMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t shadow-lg">
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        {/* Mobile Navigation Links */}
                        <div className="space-y-2">
                            <HashLink
                                to="/#about"
                                smooth
                                className="block py-2 px-4 hover:bg-gray-100 rounded"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </HashLink>
                            <HashLink
                                to="/#contact"
                                smooth
                                className="block py-2 px-4 hover:bg-gray-100 rounded"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contact
                            </HashLink>
                        </div>

                        {/* Mobile Auth Links */}
                        <div className="space-y-2 border-t pt-4">
                            {authLinks.map(link => (
                                <Button
                                    key={link.id}
                                    to={`/${link.id}`}
                                    variant="ghost"
                                    size="md"
                                    leftIcon={link.icon}
                                    className="w-full justify-start"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Button>
                            ))}
                        </div>

                        {/* Mobile CTA Button */}
                        <Button
                            to="/find-pet"
                            variant="primary"
                            size="md"
                            leftIcon={<Heart className="h-4 w-4" />}
                            className="w-full"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Find a Pet
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;