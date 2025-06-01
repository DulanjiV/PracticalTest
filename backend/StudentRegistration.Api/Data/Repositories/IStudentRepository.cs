using StudentRegistration.Api.Models.Entities;
using StudentRegistration.Api.Models.Requests;

namespace StudentRegistration.Api.Data.Repositories
{
    public interface IStudentRepository
    {
        Task<(IEnumerable<Student> Students, int TotalCount)> GetAllAsync(StudentSearchRequest request);
        Task<Student> GetByIdAsync(int id);
        Task<Student> CreateAsync(Student student);
        Task<Student> UpdateAsync(Student student);
        Task<bool> DeleteAsync(int id);
        Task<bool> EmailExistsAsync(string email, int? excludeId = null);
    }
}
