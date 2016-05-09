# Converts csv file to json
# Props to http://stackoverflow.com/questions/19697846/python-csv-to-json

usage = "Usage: python csv2json.py csvFilename"

import csv #CSV library
import json #JSON library
import sys #to read command line args
import re #regular expressions library, for splitting lines

#----------------------------------------------------------------------#
# Helper functions                                                     #
#----------------------------------------------------------------------#
def readFieldNames(filehandle):
        #read the first line
        firstLine = filehandle.readline().rstrip()
        
        #split into fields, store in array
        fieldNames = re.split(r'\s*,\s*', firstLine)
#        sys.stderr.write(fieldNames)
        return fieldNames

#----------------------------------------------------------------------#
# Main functionality                                                   #
#----------------------------------------------------------------------#

#Check arguments for validity
if (len(sys.argv) != 2):
        sys.exit(usage)

#CSV filename should be first argument
csvFilename = sys.argv[1]
if (csvFilename.endswith('.csv') == False):
    sys.exit("Input filename should be in .csv format.")

#Formulate name for json file
jsonFilename = csvFilename.replace('.csv', '.json')
    
try:
    csvFile = open(csvFilename, 'r')
    fieldNames = readFieldNames(csvFile)
    csvFile.close
except IOError:
    sys.exit("Error: couldn't open input file.")

#Open the json file for writing
jsonFile = open(jsonFilename, 'w')

#Reopen the csvfile, this time to read the values
csvFile = open(csvFilename, 'r')
reader = csv.DictReader(csvFile)

'''fieldnames = ('unique_transaction_id','transaction_status','fyq',
	'cfda_program_num','sai_number','account_title','recipient_name',
	'recipient_city_code','recipient_city_name','recipient_county_code',
	'recipient_county_name','recipient_zip','recipient_type','action_type',
	'agency_code','federal_award_id','federal_award_mod',
	'fed_funding_amount','non_fed_funding_amount','total_funding_amount',
	'obligation_action_date','starting_date','ending_date','assistance_type',
	'record_type','correction_late_ind','fyq_correction',
	'principal_place_code','principal_place_state','principal_place_cc',
	'principal_place_country_code','principal_place_zip',
	'principal_place_cd','cfda_program_title','agency_name',
	'project_description','duns_no','duns_conf_code','progsrc_agen_code',
	'progsrc_acnt_code','progsrc_subacnt_code','receip_addr1',
	'receip_addr2','receip_addr3','face_loan_guran','orig_sub_guran',
	'fiscal_year','principal_place_state_code','recip_cat_type',
	'asst_cat_type','recipient_cd','maj_agency_cat','rec_flag',
	'recipient_country_code','uri','recipient_state_code','exec1_fullname',
	'exec1_amount','exec2_fullname','exec2_amount','exec3_fullname',
	'exec3_amount','exec4_fullname','exec4_amount','exec5_fullname',
	'exec5_amount','last_modified_date')
'''

#Empty list to store the values
output = []

#Create new associative array for key/value pairs, append to output list
for each in reader:
 	row = {}
  	for field in fieldNames:
  		row[field] = each[field]
	output.append(row)

json.dump(output, jsonFile, indent=2, sort_keys=True)
