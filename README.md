# n8n-nodes-frappe-lms

This is an n8n community node for [Frappe LMS](https://frappelms.com). It lets you automate student registration, course enrollments, and batch announcements directly from your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Go to **Settings** → **Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-frappe-lms`
4. Agree to the risks and click **Install**
5. Restart n8n to load the node

## Credentials

This node requires Frappe LMS API credentials:

- **URL**: Your Frappe LMS instance URL (e.g., `https://lms.yoursite.com`)
- **API Key**: Your Frappe API key
- **API Secret**: Your Frappe API secret

To generate API credentials in Frappe:
1. Go to your Frappe LMS instance
2. Navigate to **User** → **API Access**
3. Generate a new API Key and Secret

## Operations

### Course
- **Create Course**: Create a new course with title, description, and instructors
- **Get Course**: Retrieve course details by ID
- **Get All Courses**: List all courses

### Student
- **Register Student**: Create a new student account
- **Get Student Details**: Retrieve student information by email
- **Update Student Profile**: Update student details

### Enrollment
- **Enroll Student in Course**: Enroll a student in a course (with optional batch)
- **Get Student Enrollments**: Get all enrollments for a specific student

### Communication
- **Send Announcement**: Send announcements to courses, batches, or users

## Compatibility

Tested with n8n version 2.4.8+

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Frappe LMS documentation](https://frappelms.com/docs)

## License

[MIT](LICENSE.md)
