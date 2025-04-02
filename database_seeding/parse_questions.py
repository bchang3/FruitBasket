import re
import csv
import json
import os

def process_category_name(cat_name):
  return " ".join([x.capitalize() for x in cat_name.split("-")])

category_dir = "categories"
category_count = 0
question_count = 0
question_option_count = 0
questionOptions = []
questions = []
categories = []
question_to_options = dict()
for filename in os.listdir(category_dir):
  print(filename)
  f = open(f"{category_dir}/{filename}", encoding='latin-1')
  category = {"categoryID": category_count, "categoryName": process_category_name(filename)}
  categories.append(category)
  category_count += 1
  lines = f.readlines()
  question = dict()
  correctAnswerText = ""
  questionFound = False
  answerFound = False
  for i,l in enumerate(lines):
    if l.startswith("#Q"):
      question["questionText"] = l[2:].strip()
      question["questionID"] = question_count
      question["categoryID"] = category["categoryID"]
      question_to_options[question["questionID"]] = []
      question_count += 1
      answerFound = False
      questionFound = True
    elif l.startswith("^") and questionFound:
      correctAnswerText = l[1:].strip()
      answerFound = True
    elif len(l.strip()) > 0 and answerFound and questionFound:
      questionOptionData = l.split(" ")
      newQuestionOption = dict()
      newQuestionOption["questionOptionID"] = question_option_count 
      newQuestionOption["optionLabel"] = questionOptionData[0].strip()
      newQuestionOption["optionValue"] = " ".join(questionOptionData[1:]).strip()
      newQuestionOption["questionID"] = question["questionID"] # foreign key to question
      if newQuestionOption["optionValue"] == correctAnswerText:
        question["answerOptionID"] = newQuestionOption["questionOptionID"] # foreign key to answer option
      questionOptions.append(newQuestionOption)
      question_to_options[question["questionID"]].append(newQuestionOption)
      question_option_count += 1

    elif ((len(l.strip()) == 0) or (i == len(lines) - 1)) and answerFound and questionFound:
      if (question.get("questionID") == None):
        continue # skip if no question exists
      options = question_to_options[question["questionID"]]
      if (len(options) == 2 and ((options[0]["optionValue"] == "True" and options[1]["optionValue"] == "False") or (options[0]["optionValue"] == "False" and options[1]["optionValue"] == "True"))):
        question["questionType"] = "T/F"
      else:
        question["questionType"] = "MCQ"
      if question.get("answerOptionID") == None:
        continue
      questions.append(question)
      question = dict()
      questionFound = False
    elif questionFound:
      question["questionText"] += "- " + l.strip()

  f.close()

#write to CSV
print("Writing to CSVs")
print(categories)
with open("categories.csv", mode="w+", newline="") as file:
    fieldnames = ["categoryID", "categoryName"]
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(categories)
  
with open("questions.csv", mode="w+", newline="") as file:
    fieldnames = ["questionID", "questionType", "questionText", "categoryID", "answerOptionID"]
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(questions)

with open("questionOptions.csv", mode="w+", newline="") as file:
    fieldnames = ["questionOptionID", "optionLabel", "optionValue", "questionID"]
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(questionOptions)

