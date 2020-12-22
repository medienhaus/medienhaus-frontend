import React, { useState } from 'react';
import Form, { withTheme } from '@rjsf/core';
import federation from "../../assets/data/federation.json"
import naming from "../../assets/data/naming.json"
import { Loading } from "../../components/loading";
import { useTranslation, Trans } from 'react-i18next';


const Admin = () => {
  const [namingId, setNamingId] = useState(naming.length - 1);

  const addFeds = () => {
    setNamingId(namingId + 1);
  }
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

  const namingScheme = {
    "type": "array",
    "format": "table",
    "title": "Federations",
    "uniqueItems": true,
    "items": {
      "type": "object",
      "title": "Federation",
      "properties": {
        "id": {
          "type": "integer",
          "default": namingId + 1
        },
        "faculty": {
          "type": "string",
          "default": "udk"
        },
        "type": {
          "type": "string",
          "enum": ["location", "subject", "global", "other"],
          "enumNames": ["location", "subject", "global", "other"],
          "default": "location"
        },
        "displayName": {
          "type": "string",
          "default": ""
        }
      }
    }
  };

  const fedData = federation.map(fed => (
    {
      Name: fed.name,
      Server: fed.server
    }
  ));
  const namingData = naming.map((naming, index) => (
    {
      id: naming.id,
      faculty: naming.faculty,
      type: naming.type,
      displayName: naming.displayName
    }
  ));

  const submitFed = async ({ formData }, e) => {
    console.log("Data submitted: ", formData);
  }
  const submitNaming = async ({ formData }, e) => {
    console.log("Data submitted: ", formData);
  }

  return (
    <section className="admin">
      {console.log(naming.length)}
      <h2>Federation Settings</h2>
      <Form
        tagName="div"
        schema={feds}
        formData={fedData}
        onSubmit={submitFed}
      />
      <h2>Explore list view settings</h2>
      <Form
        tagName="div"
        schema={namingScheme}
        formData={namingData}
        onSubmit={submitNaming}
      />
    </section>
  )
}
export default Admin

