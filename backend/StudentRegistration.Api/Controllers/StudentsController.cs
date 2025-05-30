using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentRegistration.Api.Models.DTOs;
using StudentRegistration.Api.Services;

namespace StudentRegistration.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _service;

        public StudentsController(IStudentService service)
        {
            this._service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStudents()
        {
            return Ok(await _service.GetAllStudentsAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentById(int id)
        {
            var student = await _service.GetStudentByIdAsync(id);
            if (student == null)
            {
                return NotFound($"Student with ID {id} not found.");
            }

            return Ok(student);
        }

        [HttpPost]
        public async Task<IActionResult> CreateStudent(CreateStudentDto createStudentDto)
        {
            return Ok(await _service.CreateStudentAsync(createStudentDto));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, UpdateStudentDto updateStudentDto)
        {
            var student = await _service.UpdateStudentAsync(id, updateStudentDto);
            if (student == null)
            {
                return NotFound($"Student with ID {id} not found.");
            }
            return Ok(student);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _service.DeleteStudentAsync(id);
            if (student == null)
            {
                return NotFound($"Student with ID {id} not found.");
            }
            return Ok(student);
        }
    }
}