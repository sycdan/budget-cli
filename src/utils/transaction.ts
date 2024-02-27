import { Configuration } from "./config.js";
import { getFormattedDate } from "./date.js";
import { print } from "./index.js";
import { TransactionPrompt } from "./prompt.js";

////
/// Data
//

export const transactionCategories: TransactionComplete["category"][] = [
  "expense",
  "income",
  "split",
  "omit",
  "skip",
];

export const transactionHeaders: TransactionHeader[] = [
  {
    // 0
    key: "id",
    header: "Transaction ID",
  },
  {
    // 1
    key: "account",
    header: "Account name",
  },
  {
    // 2
    key: "datePosted",
    header: "Posted date",
  },
  {
    // 3
    key: "amount",
    header: "Amount",
  },
  {
    // 4
    key: "description",
    header: "Description",
  },
  {
    // 5
    key: "comments",
    header: "Comments",
  },
  {
    // 6
    key: "checkNumber",
    header: "Check number",
  },
  {
    // 7
    key: "splitId",
    header: "Split ID",
  },
  {
    // 8
    key: "dateImported",
    header: "Imported date",
  },
  {
    // 9
    key: "category",
    header: "Category",
  },
  {
    // 10
    key: "subCategory",
    header: "Subcategory",
  },
  {
    // 11
    key: "expenseType",
    header: "Expense type",
  },
  {
    // 12
    key: "notes",
    header: "Notes",
  },
];

export const transactionFields: string[] = transactionHeaders.map(
  (header) => header.header
);

////
/// Types
//

export interface TransactionHeader {
  key: keyof TransactionComplete;
  header: string;
}

export interface TransactionComplete extends TransactionImported {
  dateImported: string;
  splitId: number;
  category: "expense" | "income" | "omit" | "split" | "skip";
  subCategory: string;
  expenseType: "need" | "want" | "";
  notes?: string;
}

export interface TransactionImported {
  id: string;
  datePosted: string;
  account: string;
  amount: number;
  description: string;
  comments?: string;
  checkNumber?: number;
}

////
/// Functions
//

export const mapTransaction = (
  imported: TransactionImported,
  prompt: TransactionPrompt,
  splitId = 1
): TransactionComplete => {
  const { category } = prompt;
  let { subCategory, expenseType } = prompt;

  const isSkipped = category === "omit" || category === "split";
  if (isSkipped) {
    splitId = category === "split" ? 0 : 1;
    subCategory = category;
    expenseType = "";
  }

  return {
    ...imported,
    dateImported: getFormattedDate(),
    notes: prompt.notes || "",
    splitId,
    category,
    subCategory,
    expenseType,
  };
};

export const sortTransactionsByDate = (a: string[], b: string[]): number => {
  if (a[2] > b[2]) {
    return 1;
  }
  if (a[2] < b[2]) {
    return -1;
  }
  return 0;
};

export const printTransaction = (
  transaction: TransactionImported | TransactionComplete | TransactionPrompt
) => {
  for (const transProp in transaction) {
    if (["dateImported", "account", "splitId"].includes(transProp)) {
      continue;
    }
    const label = transactionHeaders.find(
      (header) => header.key === transProp
    )?.header;
    const value = transaction[transProp as keyof typeof transaction];
    if (value) {
      print(
        `  | \u001B[1m${label || "<unknown>"}\u001B[0m: ${value ? value : "<none>"}`
      );
    }
  }
};

export const autoCategorize = (
  transaction: TransactionImported,
  config: Configuration
): TransactionPrompt | null => {
  if (!config.autoCategorization) {
    return null;
  }

  for (const matchCriteria of config.autoCategorization) {
    const { descriptions, amount, categorization } = matchCriteria;

    let matchedDescription = true;
    if (descriptions && descriptions.length) {
      matchedDescription = false;
      for (const description of descriptions) {
        matchedDescription =
          matchedDescription || transaction.description.includes(description);
      }
    }

    let matchedAmount = true;
    if (typeof amount?.gt === "number") {
      matchedAmount = transaction.amount > amount.gt;
    }
    if (matchedAmount && typeof amount?.gte === "number") {
      matchedAmount = transaction.amount >= amount.gte;
    }
    if (matchedAmount && typeof amount?.lt === "number") {
      matchedAmount = transaction.amount < amount.lt;
    }
    if (matchedAmount && typeof amount?.lte === "number") {
      matchedAmount = transaction.amount <= amount.lte;
    }

    if (matchedDescription && matchedAmount) {
      return categorization;
    }
  }

  return null;
};
