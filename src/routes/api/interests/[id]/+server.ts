import { json, type RequestHandler } from '@sveltejs/kit';
import { getInterestById, updateInterest, deleteInterest } from '$lib/database';
import type { Interest } from '$lib/database';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;
    const interest = await getInterestById(Number(id));
    
    if (!interest) {
      return json({
        success: false,
        error: 'Interest not found'
      }, { status: 404 });
    }
    
    return json({
      success: true,
      data: interest
    });
  } catch (error) {
    console.error('Error fetching interest:', error);
    return json({
      success: false,
      error: 'Failed to fetch interest'
    }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const { id } = params;
    const data = await request.json();
    const { textbox1, textbox2, textbox3, textbox4, textbox5 } = data;
    
    const updatedInterest = {
      textbox1,
      textbox2,
      textbox3: Number(textbox3),
      textbox4: Number(textbox4),
      textbox5
    };
    
    const result = await updateInterest(Number(id), updatedInterest);
    
    if (result === 0) {
      return json({
        success: false,
        error: 'Interest not found or not updated'
      }, { status: 404 });
    }
    
    return json({
      success: true,
      data: { id: Number(id) }
    });
  } catch (error) {
    console.error('Error updating interest:', error);
    return json({
      success: false,
      error: 'Failed to update interest'
    }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;
    const result = await deleteInterest(Number(id));
    
    if (result === 0) {
      return json({
        success: false,
        error: 'Interest not found or not deleted'
      }, { status: 404 });
    }
    
    return json({
      success: true,
      message: 'Interest deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting interest:', error);
    return json({
      success: false,
      error: 'Failed to delete interest'
    }, { status: 500 });
  }
};