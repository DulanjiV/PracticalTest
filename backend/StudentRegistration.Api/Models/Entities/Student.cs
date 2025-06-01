using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace StudentRegistration.Api.Models.Entities
{
    public class Student
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [MaxLength(16)]
        public string Mobile { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(12)]
        public string NIC { get; set; } = string.Empty;

        [Required]
        public DateTime DateOfBirth { get; set; }

        [MaxLength(500)]
        public string? Address { get; set; } = string.Empty;

        public byte[]? ProfileImage { get; set; }

        [MaxLength(100)]
        public string? ImageContentType { get; set; }

        public string? ProfileImageBase64
        {
            get
            {
                if (ProfileImage != null && ProfileImage.Length > 0)
                {
                    return Convert.ToBase64String(ProfileImage);
                }
                return null;
            }
        }
    }
}