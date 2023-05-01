import { FaGithub, FaLink, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer p-7 bg-neutral text-neutral-content">
      <div>
        <span className="footer-title">Project Repo</span>
        <div className="grid grid-flow-col gap-4">
          <a href="https://github.com/yukdev/Honeycrisp">
            <FaLink />
          </a>
        </div>
      </div>
      <div>
        <span className="footer-title">Socials</span>
        <div className="grid grid-flow-col gap-4">
          <a href="https://www.linkedin.com/in/yukcc/">
            <FaLinkedin />
          </a>
          <a href="https://github.com/yukdev">
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
