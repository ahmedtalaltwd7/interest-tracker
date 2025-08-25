import { json, type RequestHandler } from '@sveltejs/kit';
import { 
  createInterest, 
  getAllInterests, 
  getInterestById, 
  updateInterest, 
  deleteInterest,
  getSumOfTextbox3,
  getSumOfTextbox4
} from '$lib/database';
import type { Interest } from '$lib/database';

export const GET: RequestHandler = async () => {
  try {
    const interests = await getAllInterests();
    const sumTextbox3 = await getSumOfTextbox3();
    const sumTextbox4 = await getSumOfTextbox4();
    const difference = sumTextbox3 - sumTextbox4;
    
    // Debug logging
    console.log('Sum of Textbox 3:', sumTextbox3);
    console.log('Sum of Textbox 4:', sumTextbox4);
    console.log('Difference:', difference);
    
    return json({
      success: true,
      data: {
        interests,
        summary: {
          sumTextbox3: Number(sumTextbox3),
          sumTextbox4: Number(sumTextbox4),
          difference: Number(difference)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching interests:', error);
    return json({
      success: false,
      error: 'Failed to fetch interests'
    }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const { textbox1, textbox2, textbox3, textbox4, textbox5 } = data;
    
    const newInterest = {
      textbox1,
      textbox2,
      textbox3: Number(textbox3),
      textbox4: Number(textbox4),
      textbox5
    };
    
    const id = await createInterest(newInterest);
    
    return json({
      success: true,
      data: { id }
    });
  } catch (error) {
    console.error('Error creating interest:', error);
    return json({
      success: false,
      error: 'Failed to create interest'
    }, { status: 500 });
  }
};