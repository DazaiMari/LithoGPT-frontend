import PageMeta from "../../components/common/PageMeta";
import { useEffect } from "react";
import { motion, useViewportScroll, useTransform } from "framer-motion";

export default function Home() {
  // ====== Hooks ======
  const { scrollY } = useViewportScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 200]);

  useEffect(() => {
    const sections = document.querySelectorAll("section.fade");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );
    sections.forEach((section) => observer.observe(section));
  }, []);

  // ====== Animation Variants ======
  const glowVariants = {
    rest: { boxShadow: "0 0 0px #b91c1c" },
    hover: {
      boxShadow: "0 0 20px #b91c1c",
      transition: { duration: 0.4 },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3, duration: 0.8 },
    }),
  };

  // ====== Render ======
  return (
    <>
      <PageMeta
        title="LithoGPT | AI Stone Appreciation Platform"
        description="Discover the beauty of natural stones through AI-powered interpretation. A fusion of art, nature, and intelligence."
      />

      <main className="bg-gradient-to-b from-gray-900 to-gray-800 text-white font-sans overflow-x-hidden">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-sm text-gray-100 py-4 z-50 flex justify-center gap-8 text-sm md:text-base">
          <a href="#hero" className="hover:text-red-400 transition">
            Home｜首页
          </a>
          <a href="#about" className="hover:text-red-400 transition">
            About｜关于
          </a>
          <a href="#explore" className="hover:text-red-400 transition">
            Explore｜探索
          </a>
          <a href="#visit" className="hover:text-red-400 transition">
            Visit｜参观
          </a>
        </nav>

        {/* Hero Section */}
        <section
          id="hero"
          className="h-screen flex flex-col justify-center items-center text-center relative overflow-hidden"
        >
          <motion.div
            style={{ y: backgroundY }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1f2937_0%,#0f172a_100%)] opacity-90"
          ></motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative text-5xl md:text-7xl font-bold mb-6 text-gray-100 drop-shadow-md"
          >
            A Living Museum of Heritage and Experience
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative max-w-2xl text-gray-300 leading-relaxed text-lg md:text-xl mb-10"
          >
            Where craft, culture, and imagination meet. 每一声金属的回响，都是文化的复苏。
          </motion.p>

          <motion.a
            href="#explore"
            className="relative bg-red-800 px-6 py-3 rounded-lg text-white font-semibold shadow-md hover:bg-red-700 transition"
            variants={glowVariants}
            whileHover="hover"
            initial="rest"
            animate="rest"
          >
            Explore the Museum｜探索博物馆
          </motion.a>

          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 70%)",
                "radial-gradient(circle at 70% 70%, rgba(255,255,255,0.15) 0%, transparent 70%)",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </section>

        {/* About Section */}
        <section
          id="about"
          className="grid md:grid-cols-2 gap-12 items-center py-24 px-8 fade"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl font-semibold mb-4">
              About the Museum｜关于博物馆
            </h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Founded in 2017, the China Pewter Museum stands as a bridge
              between heritage and modernity. Located in a Ming Dynasty mansion
              in Suzhou’s Lili Ancient Town, it reimagines what a museum can be
              — living, breathing, and participatory.
              <br />
              中国锡器博物馆创立于 2017 年，位于苏州黎里古镇明代毛宅，是传统与现代的桥梁，让文化在体验中延续。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <img
              src="/images/museum-exterior.jpg"
              alt="Museum Exterior"
              className="rounded-lg shadow-lg w-full"
            />
          </motion.div>
        </section>

        {/* Explore Section */}
        <section
          id="explore"
          className="bg-gray-950 text-center py-24 fade relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05)_0%,transparent_100%)]"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-semibold mb-6 relative z-10"
          >
            Explore the Museum｜探索博物馆
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-gray-300 max-w-3xl mx-auto mb-16 relative z-10"
          >
            Follow the path of discovery — each step in the museum leads you
            deeper into the world of pewter art, where craft, history, and
            imagination meet.
            <br />
            沿着探索的路径前行——博物馆的每一步，都将你带入锡艺的世界，在这里，工艺、历史与想象相遇。
          </motion.p>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12 px-6 relative z-10">
            {[
              {
                title: "Step 1: Hall of Origins｜起源厅",
                desc: "Discover the birth of tin — where fire, earth, and human hands first met.",
                link: "#hall-origins",
              },
              {
                title: "Step 2: Craft and Life｜匠艺厅",
                desc: "See how pewter became part of daily life through utensils, tea sets, and rituals.",
                link: "#craft-life",
              },
              {
                title: "Step 3: Word and Metal｜铭文厅",
                desc: "Explore poetic inscriptions and stories engraved in pewter’s surface.",
                link: "#word-metal",
              },
              {
                title: "Step 4: Future and Design｜未来厅",
                desc: "Experience the intersection of traditional craftsmanship and modern innovation.",
                link: "#future-design",
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                variants={stepVariants}
                className="bg-gray-800 p-8 rounded-xl hover:-translate-y-2 hover:shadow-2xl transition-all"
              >
                <h3 className="text-2xl font-semibold mb-4 text-amber-400">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {step.desc}
                </p>
                <a
                  href={step.link}
                  className="text-red-400 hover:text-red-300 font-semibold transition-all"
                >
                  Learn More →
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Visit Section */}
        <section id="visit" className="text-center py-24 bg-gray-900 fade">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-semibold mb-6"
          >
            Visit Us｜参观信息
          </motion.h2>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            📍 Mao Mansion, Lili Ancient Town, Wujiang, Suzhou
            <br />🕒 9:00 – 17:00 (Closed Mondays)
            <br />🎟️ Tickets available online and on-site
          </p>
          <a
            href="mailto:info@chinapewtermuseum.cn"
            className="bg-red-800 hover:bg-red-700 px-6 py-3 rounded-lg text-white font-semibold shadow-md"
          >
            Contact Us｜联系我们
          </a>
        </section>

        {/* Footer */}
        <footer className="bg-black text-center py-8 text-gray-400 text-sm">
          <p>© 2025 China Pewter Museum | Designed with Heritage and Heart</p>
        </footer>
      </main>
    </>
  );
}
