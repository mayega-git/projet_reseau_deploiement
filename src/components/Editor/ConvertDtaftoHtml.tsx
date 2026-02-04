
/* eslint-disable @typescript-eslint/no-unused-vars */
import { convertFromRaw, ContentState, Entity, DraftEntityType } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

interface ConvertDraftToHTMLProps {
    content : string
}

const ConvertDraftToHTML: React.FC<ConvertDraftToHTMLProps> = ({ content }) => {

  if (!content) return <p>Aucun contenu disponible.</p>;
  console.log("Contenu brut reçu :", content);
  const rawContent = JSON.parse(content);

  // Convert raw content to ContentState
  const contentState = convertFromRaw(rawContent);

  // Customize options for stateToHTML
  const options = {
    inlineStyles: {
      BOLD: { element: 'strong' },
      ITALIC: { element: 'em' },
      UNDERLINE: { element: 'u' },
    },
    // blockRenderers: {
    //   unstyled: (block) => {
    //     // Custom rendering for 'unstyled' block
    //     return `<p>${block.getText()}</p>`;
    //   },
    // },
    // entityStyleFn: (entity: Entity) => {
    //   // Example: Handling LINK entity
    //   if (entity.getType() === 'LINK') {
    //     const data = entity.getData();
    //     return {
    //       element: 'a',
    //       attributes: {
    //         href: data.url,
    //         target: '_blank', // Open links in a new tab
    //       },
    //     };
    //   }
    // },
  };

  // Convert the ContentState to HTML using stateToHTML with custom options
  const htmlContent = stateToHTML(contentState, options);

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default ConvertDraftToHTML;
