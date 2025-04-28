import React, { useState } from "react";
import ContactForm from "./ContactForm";
import Contactdisplay from "./Contactdisplay";

const ContactManager = ({ C1, C2, CD }) => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div>
      {isAdding ? (
        <ContactForm setIsAdding={setIsAdding} C1={C1} C2={C2} CD={CD} />
      ) : (
        <Contactdisplay setIsAdding={setIsAdding} C1={C1} C2={C2} CD={CD} />
      )}
    </div>
  );
};

export default ContactManager;