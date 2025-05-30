using StudentRegistration.Api.Models.DTOs;
using StudentRegistration.Api.Models.Entities;

namespace StudentRegistration.Api.Services
{
    public interface IStudentService
    {
        Task<IEnumerable<Student>> GetAllStudentsAsync();
        Task<Student> GetStudentByIdAsync(int id);
        Task<Student> CreateStudentAsync(CreateStudentDto createStudentDto);
        Task<Student> UpdateStudentAsync(int id, UpdateStudentDto updateStudentDto);
        Task<bool> DeleteStudentAsync(int id);
    }
}
