import React from 'react'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          height="30px"
          alt="Logo"
        ></img>
        <span> &nbsp; WhatsApp Automation Tool</span>
      </div>
      <ul className="navbar-links">
        <li>
          <a href="#home">Bulk Message</a>
        </li>
        <li>
          <a href="#features">Personal Message</a>
        </li>
        <li>
          <a href="#schedule">Schedule message</a>
        </li>
        <li>
          <a href="#footer">Footer</a>
        </li>
        {/* <li>
          <a href="#pricing">Pricing</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li> */}
      </ul>
    </nav>
  );
}
