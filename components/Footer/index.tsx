"use client";

// import styles from './styles.module.css';
// import { useTheme } from "next-themes";

// const Footer = () => {
//   const { theme } = useTheme();

//   return (
//     <footer className={styles["footer"]}>
//       <div className={styles["footer-container"]}>
//         <div className={styles["footer-column"]}>
//           <h4>PRODUCT</h4>
//           <Link href={"/home" as unknown}>Home</Link>
//           <Link href={"/features" as unknown}>Features</Link>
//           <Link href={"/pricing" as unknown}>Pricing</Link>
//           <Link href={"/tools" as unknown}>Tools</Link>
//           <Link href={"/faq" as unknown}>FAQ</Link>
//         </div>

//         <div className={styles["footer-column"]}>
//           <h4>RESOURCES</h4>
//           <Link href={"/desktop" as unknown}>EaseMyTools Desktop</Link>
//           <Link href={"/mobile" as unknown}>EaseMyTools Mobile</Link>
//           <Link href={"/api" as unknown}>API</Link>
//           <Link href={"/docs" as unknown}>Documentation</Link>
//         </div>

//         <div className={styles["footer-column"]}>
//           <h4>SOLUTIONS</h4>
//           <Link href={"/business" as unknown}>Business</Link>
//           <Link href={"/education" as unknown}>Education</Link>
//         </div>

//         <div className={styles["footer-column"]}>
//           <h4>LEGAL</h4>
//           <Link href={"/security" as unknown}>Security</Link>
//           <Link href={"/privacy" as unknown}>Privacy Policy</Link>
//           <Link href={"/terms" as unknown}>Terms & Conditions</Link>
//           <Link href={"/cookies" as unknown}>Cookies</Link>
//         </div>

//         <div className={styles["footer-column"]}>
//           <h4>COMPANY</h4>
//           <Link href={"/about" as unknown}>About Us</Link>
//           <Link href={"/contact" as unknown}>Contact Us</Link>
//           <Link href={"/blog" as unknown}>Blog</Link>
//           <Link href={"/press" as unknown}>Press</Link>
//         </div>
//       </div>

//       <hr className={styles["footer-divider"]} />

//       <div className={styles["footer-bottom"]}>
//         <div className={styles["footer-lang"]}>
//           <select>
//             <option>English</option>
//             <option>हिंदी</option>
//           </select>
//         </div>

//         <div className={styles["footer-social"]}>
//           <Link href={"/twitter" as unknown}>✖</Link>
//           <Link href={"/facebook" as unknown}>📘</Link>
//           <Link href={"/linkedin" as unknown}>💼</Link>
//           <Link href={"/instagram" as unknown}>📸</Link>
//           <Link href={"/tiktok" as unknown}>🎵</Link>
//         </div>

//         <div className={styles["footer-copy"]}>
//           © {new Date().getFullYear()} EaseMyTools — All Rights Reserved
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;




// import styles from './styles.module.css';
// import { useTheme } from "next-themes";
// 
// const Footer = () => {
//   const { theme } = useTheme();

//   return (
//     <footer className={styles["footer"]}>
//       <div className={styles["footer-container"]}>
//         <div className={styles["footer-column"]}>
//           <h4>PRODUCT</h4>
//           <Link href={"/home" as unknown}>Home</Link>
//           <Link href={"/features" as unknown}>Features</Link>
//           <Link href={"/pricing" as unknown}>Pricing</Link>
//           <Link href={"/tools" as unknown}>Tools</Link>
//           <Link href={"/faq" as unknown}>FAQ</Link>
//         </div>

//         <div className={styles["footer-column"]}>
//           <h4>RESOURCES</h4>
//           <Link href={"/desktop" as unknown}>EaseMyTools Desktop</Link>
//           <Link href={"/mobile" as unknown}>EaseMyTools Mobile</Link>
//           <Link href={"/api" as unknown}>API</Link>
//           <Link href={"/docs" as unknown}>Documentation</Link>
//         </div>

//         <div className={styles["footer-column"]}>
//           <h4>SOLUTIONS</h4>
//           <Link href={"/business" as unknown}>Business</Link>
//           <Link href={"/education" as unknown}>Education</Link>
//         </div>

//         <div className={styles["footer-column"]}>
//           <h4>LEGAL</h4>
//           <Link href={"/security" as unknown}>Security</Link>
//           <Link href={"/privacy" as unknown}>Privacy Policy</Link>
//           <Link href={"/terms" as unknown}>Terms & Conditions</Link>
//           <Link href={"/cookies" as unknown}>Cookies</Link>
//         </div>

//         <div className={styles["footer-column"]}>
//           <h4>COMPANY</h4>
//           <Link href={"/about" as unknown}>About Us</Link>
//           <Link href={"/contact" as unknown}>Contact Us</Link>
//           <Link href={"/blog" as unknown}>Blog</Link>
//           <Link href={"/press" as unknown}>Press</Link>
//         </div>
//       </div>

//       <hr className={styles["footer-divider"]} />

//       <div className={styles["footer-bottom"]}>
//         {/* <div className={styles["footer-lang"]}>
//           <select>
//             <option>English</option>
//             <option>हिंदी</option>
//           </select>
//         </div> */}

//         <LanguageSelector/>

//         <div className={styles["footer-social"]}>
//           <Link href={"/twitter" as unknown}>✖</Link>
//           <Link href={"/facebook" as unknown}>📘</Link>
//           <Link href={"/linkedin" as unknown}>💼</Link>
//           <Link href={"/instagram" as unknown}>📸</Link>
//           <Link href={"/tiktok" as unknown}>🎵</Link>
//         </div>

//         <div className={styles["footer-copy"]}>
//           © {new Date().getFullYear()} EaseMyTools — All Rights Reserved
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import Link from "next/link";
import styles from './styles.module.css';

const Footer = () => {
  console.log("Footer was rendered");

  return (
    <footer className={styles["footer"]}>
      <div className={styles["footer-container"]}>
        <div className={styles["footer-column"]}>
          <h4>PRODUCT</h4>
          <Link href={"/" as unknown} >{"Home"}</Link>
          <Link href={"/features" as unknown} >{"Features"}</Link>
          <Link href={"/pricing" as unknown} >{"Pricing"}</Link>
          <Link href={"/tools" as unknown} >{"Tools"}</Link>
          <Link href={"/faq" as unknown} >{"FAQ"}</Link>
        </div>

        <div className={styles["footer-column"]}>
          <h4>RESOURCES</h4>
          <Link href={"/desktop" as unknown} >{"EaseMyTools Desktop"}</Link>
          <Link href={"/mobile" as unknown} >{"EaseMyTools Mobile"}</Link>
          <Link href={"/api" as unknown} >{"API"}</Link>
          <Link href={"/docs" as unknown} >{"Documentation"}</Link>
        </div>

        <div className={styles["footer-column"]}>
          <h4>SOLUTIONS</h4>
          <Link href={"/business" as unknown} >{"Business"}</Link>
          <Link href={"/education" as unknown} onClick={()=>{window.scrollTo({top:0, behavior:"smooth"})}}>{"Education"}</Link>
        </div>

        <div className={styles["footer-column"]}>
          <h4>LEGAL</h4>
          <Link href={"/security" as unknown} >{"Security"}</Link>
          <Link href={"/privacy-policy" as unknown} >{"Privacy Policy"}</Link>
          <Link href={"/terms-conditions" as unknown} >{"Terms & Conditions"}</Link>
          <Link href={"/cookie-policy" as unknown} >{"Cookie Policy"}</Link>
        </div>

        <div className={styles["footer-column"]}>
          <h4>COMPANY</h4>
          <Link href={"/about" as unknown} >{"About Us"}</Link>
          <Link href={"/contact" as unknown} >{"Contact Us"}</Link>
          <Link href={"/blog" as unknown} >{"Blog"}</Link>
          <Link href={"/press" as unknown} >{"Press"}</Link>
        </div>
      </div>

      <hr className={styles["footer-divider"]} />

      <div className={styles["footer-bottom"]}>

        <div className={styles["footer-social"]}>
          <Link href={"https://twitter.com/easemytools" as unknown} target="_blank" rel="noopener noreferrer" title="Twitter">
            ✖
          </Link>
          <Link href={"https://facebook.com/easemytools" as unknown} target="_blank" rel="noopener noreferrer" title="Facebook">
            📘
          </Link>
          <Link href={"https://linkedin.com/company/easemytools" as unknown} target="_blank" rel="noopener noreferrer" title="LinkedIn">
            💼
          </Link>
          <Link href={"https://instagram.com/easemytools" as unknown} target="_blank" rel="noopener noreferrer" title="Instagram">
            📸
          </Link>
          <Link href={"https://tiktok.com/@easemytools" as unknown} target="_blank" rel="noopener noreferrer" title="TikTok">
            🎵
          </Link>
        </div>

        <div className={styles["footer-copy"]}>
          © {new Date().getFullYear()} EaseMyTools — {"All Rights Reserved"}
        </div>
      </div>
    </footer>
  );
};

export default Footer;