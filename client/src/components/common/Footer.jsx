import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import {
    PawPrint,
    Facebook,
    Instagram,
    Twitter,
    Mail,
    Phone,
    Heart
} from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white pt-10 pb-6">
            <div className="container mx-auto px-4">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <PawPrint className="h-7 w-7 text-white" />
                            <span className="text-2xl text-white font-heading">
                                PurrfectMatch
                            </span>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Helping pets find loving homes and families find their perfect companions.
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-primary">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-white">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <HashLink
                                    to="/#about"
                                    smooth
                                    className="text-gray-400 hover:text-primary block py-1"
                                >
                                    About
                                </HashLink>
                            </li>
                            <li>
                                <HashLink
                                    to="/#contact"
                                    smooth
                                    className="text-gray-400 hover:text-primary block py-1"
                                >
                                    Contact
                                </HashLink>
                            </li>
                            <li>
                                <Link
                                    to="/find-pet"
                                    className="text-gray-400 hover:text-primary block py-1"
                                >
                                    Find a Pet
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-white">
                            Contact Us
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary" />
                                <span className="text-gray-300">+639944435770</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary" />
                                <span className="text-gray-300">norwaypogi0@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 my-6"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400">
                        © {currentYear} PurrfectMatch. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2 text-gray-400">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>Made with love for animals</span>
                    </div>

                    <div className="text-gray-400 text-sm">
                        <Link to="/privacy" className="hover:text-primary">
                            Privacy
                        </Link>
                        <span className="mx-2">•</span>
                        <Link to="/terms" className="hover:text-primary">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;