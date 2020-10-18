import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown'

// Using https://github.com/remarkjs/react-markdown for markdown

const Faq = () => {
  const faqPath = require('../../data/faq.md');
  const [markdown, setMarkdown] = useState();

  const getMarkdownText = () => {
    fetch(faqPath)
      .then((response) => response.text())
      .then((text) => setMarkdown(text));
  }
  useEffect(() => {
    getMarkdownText();
  })

  return (
    <section>
      <ReactMarkdown source={markdown} />
    </section>
  )
}

export default Faq;