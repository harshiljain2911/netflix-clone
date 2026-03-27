import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-[#141414] py-16 mt-10 border-t border-[#333]">
            <div className="max-w-[1000px] mx-auto px-6 md:px-10">
                <p className="text-[#e5e5e5] text-[16px] mb-8 font-medium">Questions? Call 000-800-040-1843</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[#737373] text-[13px] font-medium mb-8">
                    <ul className="flex flex-col space-y-3">
                        <li className="hover:underline cursor-pointer">FAQ</li>
                        <li className="hover:underline cursor-pointer">Investor Relations</li>
                        <li className="hover:underline cursor-pointer">Privacy</li>
                        <li className="hover:underline cursor-pointer">Speed Test</li>
                    </ul>
                    <ul className="flex flex-col space-y-3">
                        <li className="hover:underline cursor-pointer">Help Centre</li>
                        <li className="hover:underline cursor-pointer">Jobs</li>
                        <li className="hover:underline cursor-pointer">Cookie Preferences</li>
                        <li className="hover:underline cursor-pointer">Legal Notices</li>
                    </ul>
                    <ul className="flex flex-col space-y-3">
                        <li className="hover:underline cursor-pointer">Account</li>
                        <li className="hover:underline cursor-pointer">Ways to Watch</li>
                        <li className="hover:underline cursor-pointer">Corporate Information</li>
                        <li className="hover:underline cursor-pointer">Only on Netflix</li>
                    </ul>
                    <ul className="flex flex-col space-y-3">
                        <li className="hover:underline cursor-pointer">Media Centre</li>
                        <li className="hover:underline cursor-pointer">Terms of Use</li>
                        <li className="hover:underline cursor-pointer">Contact Us</li>
                    </ul>
                </div>
                
                <div className="flex flex-col items-center justify-center mt-12 mb-4 space-y-2">
                    <p className="text-[#737373] text-[13px] font-bold tracking-wider">NETFLIX CLONE • MADE BY HARSHIL JAIN</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
