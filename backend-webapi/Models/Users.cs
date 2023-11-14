using System.ComponentModel.DataAnnotations; //Should be good but need to check schema

namespace ReservationApp.Models
{
    public class User
    {
        [Key]
        public long NetID { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public bool IsFaculty { get; set; }
        public bool IsStudent { get; set; }
    }
}