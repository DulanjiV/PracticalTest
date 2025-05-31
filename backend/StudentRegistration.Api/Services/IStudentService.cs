using StudentRegistration.Api.Models.DTOs;
using StudentRegistration.Api.Models.Entities;
using StudentRegistration.Api.Models.Requests;

namespace StudentRegistration.Api.Services
{
    public interface IStudentService
    {
        Task<PagedResultDto<Student>> GetAllStudentsAsync(StudentSearchRequest request);
        Task<Student> GetStudentByIdAsync(int id);
        Task<Student> CreateStudentAsync(CreateStudentDto createStudentDto);
        Task<Student> UpdateStudentAsync(int id, UpdateStudentDto updateStudentDto);
        Task<bool> DeleteStudentAsync(int id);
    }
}
