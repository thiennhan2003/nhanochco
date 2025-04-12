import { useState } from "react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <section id="contact" className="py-16 bg-gradient-to-br from-[#efe2db] via-[#7c160f] to-[#1e0907]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-[#1e0907] text-center mb-6">Contact Us</h2>
        <p className="text-[#1e0907] text-center mb-12">
          If you have any questions, feel free to reach out to us!
        </p>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#1e0907] font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-[#c8907e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c160f]"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-[#1e0907] font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-[#c8907e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c160f]"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-[#1e0907] font-medium">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border border-[#c8907e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c160f]"
                placeholder="Enter your message"
                rows={4}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-[#7c160f] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#bb6f57] transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
