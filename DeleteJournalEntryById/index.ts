import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ObjectID } from "mongodb";
import createConnection from "../shared/createConnection";
import { JournalEntry, JournalEntrySchema } from "../models/journalEntry.model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const { id, userId } = req.params;

  if (id && userId) {
    const { db } = await createConnection();
    const journalEntryModel = db.model<JournalEntry>(
      "JournalEntry",
      JournalEntrySchema
    );
    try {
      journalEntryModel.deleteOne({ _id: new ObjectID(id), userId: userId });
      context.res = {
        status: 204,
        body: "Journal entry deleted successfully!",
      };
    } catch (error) {
      context.res = {
        status: 500,
        body: "Error Deleting journal entry " + id,
      };
    }
  } else {
    context.res = {
      status: 400,
      body: "The fields Journal Entry ID and User ID are required!",
    };
  }
};

export default httpTrigger;
