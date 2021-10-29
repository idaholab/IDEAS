import axios from 'axios';
import getRequirements from '../scripts/requirements';

jest.mock('axios');

test('list requirements', () => {
    const requirement = {
            "properties": {
                "id": "12345",
                "name": "long live Doge",
                "type": "lorem ipsum",
                "basis": "Justification for why some artifact exists",
                "description": "This is a project requirement to be loaded into Innoslate",
                "primary_text": "This is a requirement that has to be satisfied in order for the tool to work",
                "creation_date": "7/13/2021",
                "creation_user": "Nathan Woodruff",
                "verification_method": "DOE Inspection"
            },
            "id": "7ab9f691-2e33-4e0d-b8f4-e9e024204d4b",
            "container_id": "8a28f3c9-07c1-4e79-9c0b-2673fab703ed",
            "metatype": {
                "name": "",
                "description": "",
                "id": "d166c572-dc63-4d3b-bfd8-a44b9a9613e3"
            },
            "metatype_name": "Requirement",
            "graph_id": "73f2a198-c196-43dc-9484-6f04be51f9ed",
            "archived": false,
            "created_at": "2021-07-13T21:27:18.487Z",
            "modified_at": null,
            "original_data_id": null,
            "data_source_id": "4a4694d5-7d47-4edd-aa60-695a9b984a80",
            "deleted_at": null,
            "data_staging_id": 20316,
            "import_data_id": "ad7d20b0-d315-4cdd-825b-b9cce503ab4e",
            "type_mapping_transformation_id": "7f67dfe9-89d4-42b2-a7f6-9b158ac685d8",
            "composite_original_id": null,
            "created_by": "af9a7aac-fa61-451a-855a-bc7eb4d929bb",
            "modified_by": "af9a7aac-fa61-451a-855a-bc7eb4d929bb"
        }
    const response = {data: requirement}

    axios.get.mockResolvedValue(response);

    return getRequirements('token').then(data => expect(data).toEqual(requirement));
    
})