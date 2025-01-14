# devlog

Notes taken during development, newest to oldest. 

TODO:
- [ ] Searching transactions
- [ ] CSV table output?
- [ ] Editing transactions
- [ ] Deleting transactions
- [ ] Reconciling transactions against a folder of CSVs
- [ ] https://nutjs.dev/ for getting transactions
- [ ] Investigate Plaid importing

## [[2024-05-23]]

I've been thinking about what's irritating about budgeting and how this tool could help more, besides a list of features.

- I'm missing a way to get a better analysis of what's going on. It always feels like the window is too small or I'm taking into account the wrong stuff to get a better idea of what's happening. I can't tell if I need more granular controls and views or if I'm just overanalyzing.
- I definitely need a better way to view and manage transactions. I'm still opening up Numbers to work with the CSV and I want to move away from that.
- Downloading and managing files is a pain but now that the CLI can read from a default directory and move the files, that feels better. 

## [[2024-05-21]]

I poked around with Plaid last week and was disappointed to figure out that there is no clear way to do authorization via CLI, everything has to run through their front-end SDK. That should work fine but I'll need to sit down and spend some time with it, time I don't really have to spare at the moment. 

I've let budgeting fall behind for 3 months and now going back to handle it all. It really is such a chore to do all of this exporting and categorization. 

## [[2024-04-06]]

I took a break from this project in order to work on [my other CLI project](https://github.com/joshcanhelp/api-getter). I've been looking for a CLI framework to handle the details around arguments, flags, and distribution and found what I needed in [oclif](https://oclif.io). I'm wary about adding new non-dev dependencies but this is well-maintained by a motivated company (SalesForce) and addresses a bunch of black box things around CLIs that I just don't want to deal with. It's also structured in a way that makes it easy to keep "business" logic pretty well separated from the CLI framework.  

## [[2024-02-26]]

I starting working on the auto-categorization and I knew I wanted to be able to see the auto-categorized transaction before saving it. So I worked on the transaction printing and added that as a confirm prompt if it's able to categorize. This worked pretty well as a solution to the editing problem. Now, after the transaction is complete, you have to confirm to save it. That's helped me a few times already walking through the imports for the year. 

I got hung up on Jest testing as I was making this change. I realized that a lot of the Jest and TypeScript combination is a mystery, I just try different options until it works. I'd like to put together a TS + Node + Jest starter repo with everything all wired up so I can re-use it and *actually* understand how all of these flags are working together. It was a function of `moduleNameMapper` ([StackOverflow answer]([https://stackoverflow.com/a/69598249](https://stackoverflow.com/a/69598249))) changing the `*.js` import to remove the file extension. Why does it work in TS but not Jest? Who knows! 🪄

During my troubleshooting and testing today I tried out [csvlens](https://github.com/YS-L/csvlens) and it worked really well for navigating the CSV data output. 

## [[2024-02-23]]

This tool has been very useful for me for the last year. The satisfaction of building your own tool combined with the ability to make the tool exactly what you need have both combined to make this feel like a resounding success so far. That said, there is plenty of room for improvement here. 

Today, I'm importing 2 months worth of transactions and working through our taxes for 2023. I'm going to take notes here while I do that, focusing on making small improvements along the way and taking notes about larger ones. 

**Budget importing**

First things first: collecting all the necessary CSVs. This is a big pain in the butt, lots of manual labor here. I need to figure out what the latest transaction is for a specific account, then log in and download the right file, then import. Some banks make this worse than others. 

The CSVs that are downloaded are, in my mind, fairly important to keep, even if they are't used for importing, as they are the Source of Truth for transactions. The problem is that some banks only allow you to download a limited number of files (like, only 12 months) so this needs to be done on a regular basis (even if only annually). The only option I can think of is some kind of browser extension or automation or headless to do the steps. It has to be downloaded directly from the bank app so I don't know that there is a solution here. 

Once they're downloaded, it's time to run an import. It looks like all the defaults are working well for the import year but it could probably have a config option to point to a default directory. ✅

One big problem with importing is that if you make a mistake you need to cancel the process and start over. I looked into this before and it didn't look like there was anything in [prompt.js](https://www.npmjs.com/package/prompt) to help with this. I think the most simple way around this is to provide a summary of everything before saving it and requiring the user to accept it. This is one more step but would dovetail with the auto-categorization.