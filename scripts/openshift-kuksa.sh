#!/bin/bash
echo '*** Fetch data from Kuksa ***' >> ${OPENSHIFT_LOG_DIR}/fetch-from-kuksa.log
date >> ${OPENSHIFT_LOG_DIR}/fetch-from-kuksa.log
cd ${OPENSHIFT_REPO_DIR}
npm run fetch-from-kuksa >> ${OPENSHIFT_LOG_DIR}/fetch-from-kuksa.log
echo '*** Fetch complete ***' >> ${OPENSHIFT_LOG_DIR}/fetch-from-kuksa.log
date >> ${OPENSHIFT_LOG_DIR}/fetch-from-kuksa.log