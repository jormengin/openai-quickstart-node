import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

const animal = req.body.animal || '';
const petOwner = req.body.petOwner || '';
const dogType = req.body.dogType || '';
const theme = req.body.theme || '';
const tone = req.body.tone || '';
const length = req.body.length || '';
let storyType = ''

  if (animal.trim().length === 0 ||petOwner.trim().length === 0 ||dogType.trim().length === 0 ||theme.trim().length === 0 ||tone.trim().length === 0||length.trim().length === 0 ) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }
switch(length){
  case 'haiku':
  storyType = 'a haiku'
  break;
  case 'poem':
  storyType = 'a poem'
  break;
  case 'short':
  storyType = 'a short story of about 100 words'
  break;
  case 'medium':
  storyType = 'a medium story of about 250 words'
  break;
  case 'long':
  storyType = 'a long story of about 500 words'
  break;
}
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal,petOwner,dogType,theme,tone,length),
      temperature: 0.6,
      max_tokens:500,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal,petOwner, theme, dogType,tone,storyType) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
    const capitalizedOwner = petOwner[0].toUpperCase() + petOwner.slice(1).toLowerCase();
  return `Write a ${tone} ${storyType} that meets the following criteria. The story its about a pet and his onwer, and passed the characteristics of the story. Its not needed to add the animal type description. Just dont make a mistake when creating the story. if in dog type you see small its not needed to stay its small if the story doesnt require. But if you dont describe the animal as small, dont say its big. if its white dont say its black. And so forth.
  If its a poem or a haiku give a poem styling with  breaking paragraphs to emphazise the rhyming parts. this is very important.

  Animal name:${capitalizedAnimal}
  animal type: ${dogType}
  animal owner or owners: ${capitalizedOwner}
  this theme: ${theme}
`;

}
