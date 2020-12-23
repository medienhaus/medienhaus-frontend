import React, { useState } from 'react';
import Form, { withTheme } from '@rjsf/core';
import federation from "../../assets/data/federation.json"
import { useTranslation, Trans } from 'react-i18next';


const Admin = () => {

  const feds = {
    "type": "array",
    "format": "table",
    "title": "Federations",
    "uniqueItems": true,
    "items": {
      "type": "object",
      "title": "Federation",
      "properties": {
        "Name": {
          "type": "string",
          "default": "Medienhaus"
        },
        "Server": {
          "type": "string"
        }
      }
    },
    "default": [
      {
        "Name": "Medienhaus",
        "Server": "medienhaus.udk-berlin.de"
      }
    ]
  };

  const fedData = federation.map(fed => (
    {
      Name: fed.name,
      Server: fed.server
    }
  ));

  const submitFed = async ({ formData }, e) => {
    console.log("Data submitted: ", formData);
  }
  return (
    <section className="admin">
      <h2>Federation Settings</h2>
      <Form
        tagName="div"
        schema={feds}
        formData={fedData}
        onSubmit={submitFed}
      />
    </section>
  )
}
export default Admin

