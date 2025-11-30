import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { Home, Mail, Phone, Search, Users, Clock, Shield } from "lucide-react";
import DefaultLayout from "@/layouts/default";

const About: React.FC = () => {
  return (
    <DefaultLayout>
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Header */}
      <div className="bg-gray-800 text-white p-8 rounded-xl relative">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">About Licxo</h1>
          <p className="opacity-90">Your Trusted Property Partner</p>
        </div>

        <Shield className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 opacity-80" />
      </div>

      {/* Main Card */}
      <Card className="mt-5 shadow-lg">
        <CardBody className="p-6 space-y-12">
          {/* Mission */}
          <div className="text-center max-w-2xl mx-auto">
            <Home className="w-12 h-12 text-gray-800 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Our Mission
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Discover your ideal PG or rental house with LicXo. We connect
              property owners with tenants to make finding accommodations easier
              and faster.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
            <div className="text-center">
              <Search className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Easy Search</h3>
              <p className="text-gray-600">
                Find perfect accommodation with our intuitive search system.
              </p>
            </div>

            <div className="text-center">
              <Users className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">
                Direct Connection
              </h3>
              <p className="text-gray-600">
                Connect directly with property owners and tenants.
              </p>
            </div>

            <div className="text-center">
              <Clock className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Quick Process</h3>
              <p className="text-gray-600">
                Save time with our streamlined rental process.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <Card className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
              Get in Touch
            </h2>

            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-800" />
                <a
                  href="tel:+918085439701"
                  className="text-gray-800 hover:text-primary"
                >
                  +91 8085439701
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-800" />
                <a
                  href="mailto:licxorental@gmail.com"
                  className="text-gray-800 hover:text-primary"
                >
                  licxorental@gmail.com
                </a>
              </div>
            </div>
          </Card>

          {/* Footer trust message */}
          <div className="text-center text-gray-600 pt-4 border-t">
            Trusted by property owners and tenants across India.
          </div>
        </CardBody>
      </Card>
    </div>
    </DefaultLayout>
  );
};

export default About;
