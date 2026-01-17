import { Link } from "react-router-dom";
import {
    Search,
    MapPin,
    Phone,
    Mail,
    ChevronDown,
    Heart,
    PawPrint,
    Users,
    Star,
    TrendingUp,
    CheckCircle,
    Facebook,
    Instagram,
    Twitter,
    Clock
} from "lucide-react";
import homeBg from "@/assets/images/homeBg.png";
import aboutImg from "@/assets/images/aboutImg.png";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const Home = () => {
    return (
        <main className="pt-16">
            <Header />
            <section
                id="home"
                className="min-h-screen flex items-center justify-center relative overflow-hidden"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.88)), url(${homeBg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed"
                }}
            >
                <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-10">
                    {/* Hero Text */}
                    <div className="text-center max-w-4xl space-y-6">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading text-black tracking-tight">
                            Looking for a{" "}
                            <span className="text-primary">Purrfect</span> pet?
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                            Find your perfect furry companion with our trusted
                            pet adoption platform
                        </p>
                    </div>

                    {/* CTA Buttons - Improved */}
                    <div className="flex flex-col sm:flex-row gap-5 items-center">
                        <Link
                            to="/find-pet"
                            className="inline-flex items-center justify-center gap-3 rounded-full
                            bg-primary hover:bg-primary/90 text-white px-8 py-4 text-2xl 
                            transition-all duration-300 hover:scale-105 hover:shadow-xl 
                            shadow-lg active:scale-95"
                        >
                            <Search className="h-6 w-6" />
                            <span>Find Your Pet</span>
                        </Link>

                        <Link
                            to="/about"
                            className="inline-flex items-center justify-center gap-3 rounded-full
                            bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 
                            px-8 py-4 text-2xl transition-all duration-300 
                            hover:scale-105 hover:shadow-lg active:scale-95"
                        >
                            <Heart className="h-6 w-6 text-primary" />
                            <span>Learn More</span>
                        </Link>
                    </div>

                    {/* Metrics - Enhanced */}
                    <div className="grid grid-cols-2 md:grid-cols-4 mx-auto max-w-6xl gap-6 md:gap-8 mt-12">
                        {[
                            {
                                value: "1,200+",
                                label: "Pets Adopted",
                                icon: (
                                    <PawPrint className="h-8 w-8 text-primary" />
                                )
                            },
                            {
                                value: "5,000+",
                                label: "Happy Families",
                                icon: <Users className="h-8 w-8 text-primary" />
                            },
                            {
                                value: "50+",
                                label: "Pet Categories",
                                icon: <Heart className="h-8 w-8 text-primary" />
                            },
                            {
                                value: "98%",
                                label: "Success Rate",
                                icon: (
                                    <TrendingUp className="h-8 w-8 text-primary" />
                                )
                            }
                        ].map((metric, index) => (
                            <div
                                key={index}
                                className="text-center space-y-4 p-6 rounded-2xl 
                                bg-white/80 backdrop-blur-sm border border-gray-100 
                                shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="flex justify-center">
                                    <div className="p-3 rounded-full bg-primary/10">
                                        {metric.icon}
                                    </div>
                                </div>
                                <h3 className="text-4xl font-bold text-gray-900">
                                    {metric.value}
                                </h3>
                                <p className="text-gray-600 font-medium">
                                    {metric.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section
                id="about"
                className="min-h-screen bg-white flex items-center py-20"
            >
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 items-center">
                    <div className="flex flex-col space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl font-heading">
                                About{" "}
                                <span className="text-primary">
                                    PurrfectMatch
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                PurrfectMatch is a trusted platform connecting
                                loving families with pets in need of a forever
                                home. We believe every pet deserves a chance at
                                happiness and every family deserves the joy of a
                                perfect companion.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-800">
                                Why Choose PurrfectMatch?
                            </h2>
                            {[
                                {
                                    id: 1,
                                    description:
                                        "Verified and healthy pets with complete medical records"
                                },
                                {
                                    id: 2,
                                    description:
                                        "Personalized matching based on lifestyle and preferences"
                                },
                                {
                                    id: 3,
                                    description:
                                        "Post-adoption support and guidance from pet experts"
                                },
                                {
                                    id: 4,
                                    description:
                                        "Transparent adoption process with no hidden fees"
                                }
                            ].map(feature => (
                                <div
                                    key={feature.id}
                                    className="flex items-start gap-4"
                                >
                                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                                    <span className="text-lg text-gray-700">
                                        {feature.description}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center lg:justify-end">
                        <img
                            src={aboutImg}
                            alt="Happy family with adopted pet"
                            className="rounded-3xl border-8 border-primary shadow-2xl
                            max-w-md w-full h-auto object-cover"
                        />
                    </div>
                </div>
            </section>

{/* Contact Section */}
<section
    id="contact"
    className="min-h-screen bg-gray-50 flex items-center py-20"
>
    <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading text-gray-900 mb-4">
                Get in <span className="text-primary">Touch</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Have questions or want to learn more about our adoption process? 
                We're here to help you find your perfect companion.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info Cards - Simplified */}
            <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Contact Information
                </h3>

                {[
                    {
                        icon: <Phone className="h-6 w-6" />,
                        title: "Phone Number",
                        detail: "+639944435770",
                        description: "Available Mon-Sat 9AM-6PM"
                    },
                    {
                        icon: <Mail className="h-6 w-6" />,
                        title: "Email Address",
                        detail: "norwaypogi0@gmail.com",
                        description: "We respond within 24 hours"
                    }
                ].map((item, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 
                        hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-full bg-primary/10 text-primary">
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                                    {item.title}
                                </h4>
                                <p className="text-lg text-gray-700 mb-2">
                                    {item.detail}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Social Media - Simplified */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">
                        Follow Us
                    </h4>
                    <div className="flex gap-4">
                        {[
                            { icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
                            { icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
                            { icon: <Twitter className="h-5 w-5" />, label: "Twitter" }
                        ].map((social, index) => (
                            <a
                                key={index}
                                href="#"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg 
                                bg-gray-100 hover:bg-primary/10 text-gray-700 
                                hover:text-primary transition-colors duration-300"
                            >
                                {social.icon}
                                <span>{social.label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Form - Remains the same */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Send us a Message
                </h3>
                <p className="text-gray-600 mb-8">
                    Fill out the form below and we'll get back to you as soon as possible.
                </p>

                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium">
                                First Name *
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 
                                focus:border-primary focus:ring-2 focus:ring-primary/20 
                                transition-colors duration-300 outline-none"
                                placeholder="John"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 
                                focus:border-primary focus:ring-2 focus:ring-primary/20 
                                transition-colors duration-300 outline-none"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 
                            focus:border-primary focus:ring-2 focus:ring-primary/20 
                            transition-colors duration-300 outline-none"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                            Subject *
                        </label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 
                            focus:border-primary focus:ring-2 focus:ring-primary/20 
                            transition-colors duration-300 outline-none"
                        >
                            <option value="">Select a topic</option>
                            <option value="adoption">Pet Adoption Inquiry</option>
                            <option value="support">Technical Support</option>
                            <option value="partnership">Partnership Opportunity</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                            Message *
                        </label>
                        <textarea
                            rows={5}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 
                            focus:border-primary focus:ring-2 focus:ring-primary/20 
                            transition-colors duration-300 outline-none resize-none"
                            placeholder="Tell us how we can help you..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 
                        text-white font-semibold text-lg transition-all duration-300 
                        hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    </div>
</section>
            <Footer />
        </main>
    );
};

export default Home;
