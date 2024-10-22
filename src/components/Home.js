// components/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
    Settings, 
    GitMerge, 
    PlayCircle, 
    Edit3,
    Github,
    Linkedin,
    Mail
  } from "lucide-react";
const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Create Rules",
      description:
        "Design and implement custom business rules with our intuitive rule builder",
      icon: <Settings className="w-12 h-12 text-blue-500" />,
      path: "/create",
      color: "bg-blue-50",
    },
    {
      title: "Combine Rules",
      description:
        "Merge multiple rules to create complex rule chains and decision trees",
      icon: <GitMerge className="w-12 h-12 text-purple-500" />,
      path: "/combine",
      color: "bg-purple-50",
    },
    {
      title: "Evaluate Rules",
      description: "Test your rules against real data and get instant results",
      icon: <PlayCircle className="w-12 h-12 text-green-500" />,
      path: "/evaluate",
      color: "bg-green-50",
    },
    {
      title: "Modify Rules",
      description:
        "Update and manage existing rules with our powerful rule editor",
      icon: <Edit3 className="w-12 h-12 text-orange-500" />,
      path: "/modify",
      color: "bg-orange-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Rule Engine Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Build, combine, and evaluate business rules with our powerful and
            intuitive rule engine platform
          </p>
 
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.color} rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer`}
              onClick={() => navigate(feature.path)}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>



      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white">
            Create your first rule today and experience the power of our rule
            engine platform
          </p>

          <button
            onClick={() => navigate("/create")}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
          >
            Create Your First Rule
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">
              © 2024 Rule Engine Platform. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://github.com/sandesh300"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                <Github className="w-7 h-7" />
              </a>
              <a
                href="https://www.linkedin.com/in/sandesh-bhujbal-b3a16a222/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                <Linkedin className="w-7 h-7" />
              </a>
              <a
                href="mailto:bhujbalsandesh52@gmail.com"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                <Mail className="w-7 h-7" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
