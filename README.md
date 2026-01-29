# Honkai: Star Rail Wiki

This project is meant to be a database for players of Honkai: Star Rail to see characters, lightcones, builds, relics and much more.

The info was retrieved using the repository [Kel-Z HSR-Data Repository](https://github.com/kel-z/HSR-Data).

The project is made into 2 parts divided into 2 repositories, the backend and the frontend, the backend is in the following link: [Backend-Repository](https://github.com/CristianFiguerolaVicedo/HSRWiki-backend).

## Setting up the project

In order to use the project you have to first clone both repositories. To do that, open the terminal and navigate to the folder where you want to clone both repositories and execute `git clone https://github.com/CristianFiguerolaVicedo/HSRWiki-frontend.git` for the frontend repository and `git clone https://github.com/CristianFiguerolaVicedo/HSRWiki-backend.git` for the backend repository.

After doing this, open both parts on your favourite code editor (Recommended: IntelliJIdea for the backend and Visual Studio Code for the frontend). On the backend part, open the project and run it. For the frontend, open the project and execute in the terminal `npm install` to install all the necessary dependencies of the project. After that, execute `npm run dev` and do `Ctrl + click` to on the link that will appear to open the project on the browser.

## Objective of the project

### Tecnichal objectives

The main purpose of this project on the technical ambit was to practice how to retrieve information from GitHub repositories, format it, extract it, work with it and return it how I needed it.

As well as select the information and how the information is retrieved from the repository.

### Web objectives

The main objective of this application is to be clear, appealing to watch and user-friendly. The main focus is to display the information in an easy and clear way for the user to see it without getting confused.

The colors are not to bright to be appealing to the sight and the info is disposed in a way that is easily identified.

## Parts of the web

- [Characters](#characters)
  - [Character List](#character-list)
  - [Character Filters](#character-filters)
  - [Character Details](#character-details)
    - Overview
    - Skills
    - Traces
    - Eidolons
    - Builds 
 
- [Lightcones](#lightcones)
  - [Lightcone List](#lightcone-list)
  - [Lightcone Filters](#lightcone-filters)
  - [Lightcone Details](#lightcone-details)
    
- [Relics and planars](#relics-and-planars)
  - [Relics and planars List](#relics-and-planars-list)
  - [Relics and planars Details](#relics-and-planars-details)

-  [Planets](#planets)
  - [Planets List](#planets-list)
  - [Planet Details](#planet-details)
  
- [Factions](#factions)
  - [Factions List](#factions-list)
  - [Faction Details](#faction-details)

- [Items](#items)
  - [Items List](#items-list)
  - [Items Filter](#items-filter)
  - [Item Details](#item-details)

- [Tier List](#tier-list)
 
## Characters

In this sectino we will see the different parts of the character part.

The details, the list and the way to filter the characters.

### Character List

Here we display all the characters in alphabetical order by default but we can change that.

We show every characters in their own card with their image, name, element and path.

<img width="880" height="691" alt="image" src="https://github.com/user-attachments/assets/c7884dda-3974-479d-88d5-07a667d3ed7a" />

### Character Filters

With this filters we show the characters depending on their rarity (5 or 4 stars), element and/or path.

We also can sort the characters shown by alphabetical order (A-Z), element, path or rarity (High-Low)

<img width="880" height="531" alt="image" src="https://github.com/user-attachments/assets/dd7eceaa-4553-416f-8ac3-093e706772c0" />

### Character Details

When clicking any character in the list it shows a page with details of the characters. It shows an overview, the skills, the traces, the eidolons and the recommended build. We are going to explain each one more carefully.

<img width="1200" height="584" alt="image" src="https://github.com/user-attachments/assets/fa84cea6-7b95-48f8-aac0-9ed52b04a9ef" />

#### Overview

Here we have a general view at the stats of the character at each level.

<img width="1196" height="954" alt="image" src="https://github.com/user-attachments/assets/9e2ffa57-536a-4e3c-9d8c-9ee2fe03a8c5" />

#### Skills

In this tab we see all of the different abilities, their description and effects and their scaling when upgrading it.

<img width="1187" height="866" alt="image" src="https://github.com/user-attachments/assets/1478115d-6618-495e-be71-598679190d20" />

Here, for example, we can see the basic attack and the skill.

#### Traces

In this part we see the traces we unlock as we upgrade the character and the stats it gains from this.

<img width="1211" height="825" alt="image" src="https://github.com/user-attachments/assets/9044c164-529a-459d-9156-098337d9d485" />

#### Eidolons

Here we can see the name and description of the eidolons, which you get by having multiple copies of the same character.

<img width="1188" height="497" alt="image" src="https://github.com/user-attachments/assets/6ecfca19-cda5-43fa-ad23-59020bf4b79f" />

#### Builds

Finally, in this part there are the recommended lightcones, relics, planars, stats, sub stats and teams for the characters.

<img width="1178" height="831" alt="image" src="https://github.com/user-attachments/assets/7631cf26-0b43-43b0-add9-e1c92245717d" />

<img width="1178" height="592" alt="image" src="https://github.com/user-attachments/assets/71a78c23-bbd0-4557-a1c2-0749ccc393a3" />

## Lightcones

As we saw in the characters, here we see a list of all the available lightcones, the weapons that can be equipped, in the current patch.

Each one is in their card with their name, rarity and path.

### Lightcone List

In this page we see the list of lightcones, showing, as we said before, their image and info.

<img width="885" height="732" alt="image" src="https://github.com/user-attachments/assets/14c81c19-ff2a-4226-bf60-622c819e62ef" />

### Lightcone Filters

As we saw in the characters, here we can also filter by the rarity (5, 4 or 3 stars) and the path.

We can, as well as in characters, sort by alphabetical order, rarity or path.

<img width="870" height="364" alt="image" src="https://github.com/user-attachments/assets/1b781487-81dc-4176-ac81-c4ecff4eec41" />

### Lightcone Details

When clicking any lightcone we see their details page.

At fist we have the image, name and rarity of the lightcone and next to it, the stats that it gives at level 1 - level 80 (the maximum).

<img width="1210" height="584" alt="image" src="https://github.com/user-attachments/assets/5a2266e9-5de3-4e13-a28e-1fae6dcf0ada" />

Below this, we can see the description of the lightcone, sort of a mini-history.

And below this we have the effect of it and the scaling depending on the level of superimposition (the copies of the same lightcone, same thing as the eidolons of the characters).

<img width="1203" height="722" alt="image" src="https://github.com/user-attachments/assets/9a74f059-6731-4897-836a-9f6e6963d4c4" />

## Relics and planars

In this tab we have the info of all the relic sets and planar sets, the equipment that every character can have and gives buffs depending on which one you choose.

### Relics and planars List

In this page we display the list of all the available relic sets and below it the planar sets with the image and name of each one.

<img width="858" height="620" alt="image" src="https://github.com/user-attachments/assets/56bfeb7b-aed3-4a02-875e-953e7f8f7130" />

### Relics and planars Details

As we said in the previous pages, here we see the details of every relic and planar set, the effect, which is triggered when equipping 2 or 4 pieces,as well as their pieces.

<img width="1190" height="761" alt="image" src="https://github.com/user-attachments/assets/d53c605b-a74a-48c9-82ee-058c218335ed" />
This shows a relic set details

<img width="1201" height="620" alt="image" src="https://github.com/user-attachments/assets/a6db1eb3-a5d3-4ce8-8643-6efdc4e6be92" />
This one shows a planar set

## Planets

In this section there are the different planets in the game with their details, info, images and related characters.

### Planets List

As we have been seeing we have a list of all the planets, everyone displayed in their own card with an image and the name of the planet.

<img width="872" height="938" alt="image" src="https://github.com/user-attachments/assets/c295e674-7986-400c-9af1-b638c1002780" />

### Planet Details

When clicking any planet we see their own detail page. We can see a carroussel displaying images of the planet, below it some information about it and below that we see the characters from or related to this planet.

<img width="942" height="922" alt="image" src="https://github.com/user-attachments/assets/4607fc5b-db62-4fc5-badf-a49275897f00" />

<img width="952" height="513" alt="image" src="https://github.com/user-attachments/assets/ffa86fa6-f0af-49f4-a125-65a0ff2224d6" />

## Factions

This part shows the different factions that we come across in the game. Each one has a description of their history, goals, and future plans, as well as their members.

### Faction List

Here we can see the list of different factions with their respactive name and representative image.

<img width="871" height="933" alt="image" src="https://github.com/user-attachments/assets/2c9a3549-0161-4a85-a8b4-5ce509e6842d" />

### Faction Details

When clicking any faction we can see their detail page with a description and the characters related to or belonging to this faction.

<img width="926" height="682" alt="image" src="https://github.com/user-attachments/assets/6c9e0419-1302-4401-98c6-772ff59fae68" />

## Items

The game has many available items, here we can see a list of everyone of them grouped by their type and sub type.

### Items List

As in the other pages we have a list of every item, but this time they are in collapsable containers for comfort and performance reasons.

<img width="868" height="777" alt="image" src="https://github.com/user-attachments/assets/9c69c157-de91-4663-9a51-f71d106322d3" />

### Items Filters

As in characters and lightcone, here we can filter the items that we want to see.

We can filter by rarity (1-5 stars) and by the type.

Also we can sort alphabetically, by rarity or by type.

<img width="865" height="368" alt="image" src="https://github.com/user-attachments/assets/e55593b1-152d-4686-a1bd-a6132d85be6f" />

### Item Details

As every item has its own parametres we can see the details when clicking any item.

<img width="951" height="361" alt="image" src="https://github.com/user-attachments/assets/902aaee0-cc61-4662-a543-81e040251602" />

We can see an image, their rarity, type and subtype.

## Tier List

In this final page we can see a list of the better and most used characters ordered by ther tier from T0 being the best to T5 being the worst.

<img width="890" height="902" alt="image" src="https://github.com/user-attachments/assets/af495b21-6d73-4d43-8057-59b7429d69e4" />
<img width="880" height="361" alt="image" src="https://github.com/user-attachments/assets/607e7da1-3513-422b-a768-8d5863d6a100" />
