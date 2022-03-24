<template>
  <div>
    <h2 class="innoslate_title">Innoslate Reports</h2><br><br>
    <!-- {{ vault_data }} -->
    <div class="windchill_home">

      <OrganizationSelector
        v-if="organizations!=null"
        v-on:setOrganization="setOrganization"
        :organizations="organizations"
      />

      <ProjectSelector
        v-if="projects!=null"
        v-on:setProject="setProject"
        :projects="projects"
      />

      <DocumentSelector
        v-if="documents!=null"
        v-on:setDocument="setDocument"
        :documents="documents"
      />

      <Card
        v-if="selected_doc!=null"
        icon="mdi-printer-outline"
        cardTitle="Generate formatted documents"
      >
        <v-btn color="#4ebf94" @click="makeNRIC">NRIC</v-btn>&nbsp;
        <v-btn color="#D12335" @click="makeMFC">MFC</v-btn>
      </Card>

      <Login v-if="innoslate_key==null" v-on:setKeyString="setKeyString"/>

      <Card v-else icon="mdi-logout-variant" cardTitle="Log out">
        <v-btn @click="logout">Logout</v-btn>
      </Card>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Card from '@/../components/card/Card.vue'
import Login from './InnoslateReports/Login.vue'
import OrganizationSelector from './InnoslateReports/OrganizationSelector.vue'
import ProjectSelector from './InnoslateReports/ProjectSelector.vue'
import DocumentSelector from './InnoslateReports/DocumentSelector.vue'
export default {
  name: 'InnoslateReports',
  data: () => ({
    health: false,
    innoslate_key: null,
    organizations: null,
    selected_org: null,
    projects: null,
    selected_proj: null,
    documents: null,
    selected_doc: null,
    selected_doc_name: null
  }),
  components: {
    Card,
    Login,
    OrganizationSelector,
    ProjectSelector,
    DocumentSelector
  },
  methods: {
    async check_health () {
      await axios.get('/api/apps/innoslate-reports/health').then(response => {
        if (response.data) {
          if (response.data[0]) {
            if (response.data[0].value == 'OK') {
              this.health = true;
            }
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
    setKeyString(e) {
      this.innoslate_key = e
      this.get_organizations()
    },
    async get_organizations() {
      await axios.get(
        `/api/adapters/innoslate/list_organizations/${this.innoslate_key}`,
      ).then(response => {
        this.organizations = response.data[0].organizations
      })
    },
    setOrganization(e) {
      this.selected_org = e
      this.getProjects()
    },
    async getProjects() {
      await axios.get(
        `/api/adapters/innoslate/list_projects/${this.selected_org}/${this.innoslate_key}`,
      ).then(response => {
        this.projects = response.data[0].projects
      })
    },
    setProject(e) {
      this.selected_proj = e
      this.getDocuments()
    },
    async getDocuments() {
      await axios.get(
        `/api/apps/innoslate-reports/${this.selected_org}/${this.selected_proj}/documents/${this.innoslate_key}`,
      ).then(response => {
        this.documents = response.data
      })
    },
    setDocument(e) {
      this.selected_doc = e
      this.selected_doc_name = this.documents.find(x => x.id == e).name
    },
    makeNRIC: function() {
      axios({
        url: `/api/apps/innoslate-reports/${this.selected_org}/report/NRIC/${this.selected_doc}/${this.innoslate_key}`,
        method: 'GET',
        responseType: 'blob'
      }).then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', this.selected_doc_name + '-NRIC.docx');
        document.body.appendChild(fileLink);
        fileLink.click();
      })
    },
    makeMFC: function() {
      axios({
        url: `/api/apps/innoslate-reports/${this.selected_org}/report/MFC/${this.selected_doc}/${this.innoslate_key}`,
        method: 'GET',
        responseType: 'blob'
      }).then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', this.selected_doc_name + '-MFC.docx');
        document.body.appendChild(fileLink);
        fileLink.click();
      })
    },
    logout() {
      this.innoslate_key = null
    }
  },
  computed: {
  },
  mounted: function() {
    this.check_health()
  }
}
</script>

<style scoped>
.innoslate_title {
  font-weight: 100;
}

.windchill_home {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.hostname_message {
  color: white;
}

.hostname_url {
  color: #4ebf94;
}

.accessible {
  color: #4ebf94;
}

.inaccessible {
  color: #D12335;
}
</style>
